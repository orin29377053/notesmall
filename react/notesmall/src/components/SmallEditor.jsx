/** @jsxImportSource @emotion/react */
import ReadMarkdown from "./ReadMarkdown";
import "remirror/styles/all.css";
import React, { useCallback, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import data from "svgmoji/emoji.json";
import { marked } from "marked";
import debounce from "lodash.debounce";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority } from "remirror";
import { getPresignedUrl, handleUpload } from "./ImageUpload";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { useSelector, useDispatch } from "react-redux";
import TurndownService from "turndown";
import AddnewDocument from "./AddnewDocument";
import "../App.css";
import { editingDocument, updatingTitle, count } from "../action/document";
import { Row, Stack } from "react-bootstrap";
import {
    BlockquoteExtension,
    BoldExtension,
    BulletListExtension,
    CodeBlockExtension,
    CodeExtension,
    HardBreakExtension,
    HeadingExtension,
    ItalicExtension,
    LinkExtension,
    ListItemExtension,
    MarkdownExtension,
    OrderedListExtension,
    StrikeExtension,
    TableExtension,
    TrailingNodeExtension,
    TextHighlightExtension,
    EmojiExtension,
    DropCursorExtension,
    ImageExtension,
    UnderlineExtension,
    HorizontalRuleExtension,
} from "remirror/extensions";
import {
    Toolbar,
    Remirror,
    ThemeProvider,
    useHelpers,
    useRemirror,
    useKeymap,
    useRemirrorContext,
    BasicFormattingButtonGroup,
    DataTransferButtonGroup,
    HeadingLevelButtonGroup,
    HistoryButtonGroup,
    VerticalDivider,
    ToggleOrderedListButton,
    ToggleBlockquoteButton,
    InsertHorizontalRuleButton,
    ToggleBulletListButton,
    OnChangeJSON,
    OnChangeHTML,
} from "@remirror/react";
import { useEffect } from "react";

function EditorToolbar() {
    return (
        <Toolbar>
            <HistoryButtonGroup />
            <VerticalDivider />
            <DataTransferButtonGroup />
            <VerticalDivider />
            <HeadingLevelButtonGroup showAll />
            <VerticalDivider />
            <BasicFormattingButtonGroup />
            <VerticalDivider />
            <ToggleBlockquoteButton />
            <InsertHorizontalRuleButton />
            <ToggleBulletListButton />
            <ToggleOrderedListButton />
        </Toolbar>
    );
}

function uploadHandler(files) {
    const promises = [];

    for (const { file, progress } of files) {
        promises.push(
            () =>
                new Promise(async (resolve) => {
                    const reader = new FileReader();
                    const url = await getPresignedUrl(file.name);
                    await handleUpload(url.presignedUrl, file);

                    reader.addEventListener(
                        "load",
                        (readerEvent) => {
                            resolve({
                                src: url.objectUrl,
                                fileName: file.name,
                            });
                        },
                        { once: true }
                    );
                    reader.readAsDataURL(file);
                })
        );
    }

    return promises;
}

const hooks = [
    () => {
        const { getJSON, getMarkdown } = useHelpers();
        const handleSaveShortcut = useCallback(
            ({ state }) => {
                const markdown = getMarkdown();

                // const sss = useSelector(res => res.editingDocument);

                const postdata = { data: markdown };
                const contentID = "wwswd";
                // Ded()
                // console.log(markdown)

                // // post the markdown to the backend server
                // const query = `
                // mutation{
                //     updatedDocument(document: { _id: ${contentID}, content: "${markdown}" }) {
                //         title
                //     }}
                //     `;

                // fetch("http://localhost:8000/graphql", {
                //     method: "POST",
                //     body: JSON.stringify({ query }),
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                // });
                // SendDocument()
                return true; // Prevents any further key handlers from being run.
            },
            [getJSON]
        );

        // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
        useKeymap("Mod-s", handleSaveShortcut);
    },
];

// update the editor content with the markdown content
const MdToContent = ({ htmlContents }) => {
    const { setContent } = useRemirrorContext();
    setContent(htmlContents);
    return;
};
const TextEditor = () => {
    const { getRootProps } = useRemirrorContext();

    return <div {...getRootProps()} />;
};

const changeTitle = debounce((id, title) => {
    if (title) {
        const query = `
            mutation{
                updatedDocument(document: { _id: "${id}", title: "${title}"}) {
                    title
                }}
                `;
        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        //TODO: sync animation

        console.log("please type title");
    }
}, 1000);

const SmallEditor = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // const [htmlContents, setHtmlContent] = useState();
    // const [oldid, setId] = useState();
    // const [title, setTitle] = useState("");
    const document = useSelector((state) => state?.editingDocument);
    const count = useSelector((state) => state?.count);
    const title = document?.title;
    const content = document?.content;
    console.log("title", title);

    const { manager, state } = useRemirror({
        extensions: [
            ...extensions(),
            new ImageExtension({
                enableResizing: true,
                uploadHandler: uploadHandler,
            }),
        ],
        content: "<p>I love <b>Remirror</b></p>",
        selection: "start",
        stringHandler: "markdown",
    });

    const handleEditorChange = async (html) => {
        const turndownService = new TurndownService({
            // keep: 'code[data-language]',
            codeBlockStyle: "fenced",
            fence: "```",
        });
        const markdown = turndownService.turndown(html);
        const query = `
                mutation{
                    updatedDocument(document: { _id: "${id}",content: """${markdown}""" , title: "${title}"}) {
                        content
                    }}
                    `;
        await fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        dispatch({ type: "UPDATING_CONTENT", payload: { content: markdown } });
    };

    const getEssay = (id) => {
        console.log("getid");
        if (id) {
            const query = `
        query{
            document( id: "${id}") {
                _id
                title
                content
                updated_at
            }
        }
        `;
            fetch("http://localhost:8000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            })
                .then((res) => res.json())
                .then((res) => {
                    const document = marked(res.data.document.content);
                    // setHtmlContent(document);
                    // setId(res.data.document._id);
                    // setTitle(res.data.document.title);
                    dispatch(editingDocument(res.data.document));
                });
        }
    };

    useEffect(() => {
        getEssay(id);
    }, [id]);

    useEffect(() => {
        changeTitle(id, title);
    }, [title]);

    return (
        <AllStyledComponent>
            {/* the className is used to define css variables necessary for the editor */}

            <ThemeProvider>
                <Remirror
                    manager={manager}
                    initialContent={state}
                    hooks={hooks}
                    // onChange={handleEditorChange}
                    // autoRender="false"
                >
                    {/* <SendDocument /> */}
                    {/* <AddnewDocument /> */}
                    <Row className="px-3 mb-2 mt-3">
                        <input
                            
                            type="text"
                            value={title}
                            onChange={(e) => {
                                if (e.target.value) {
                                    dispatch({
                                        type: "UPDATING_TITLE",
                                        payload: { title: e.target.value },
                                    });
                                    // setTitle(e.target.value)
                                } else {
                                    alert("please type title");
                                }
                            }}
                            css={css`
                                padding: 0.25rem;
                                border: none;
                                border-bottom: 1px solid #ccc;
                                font-size: 2rem;
                                font-weight: 700;
                                margin-bottom: 1rem;

                            `}
                        ></input>
                    </Row>
                    <Row className="px-1 mb-4">
                        <EditorToolbar />
                    </Row>
                    <MdToContent htmlContents={content} />
                    <OnChangeHTML
                        onChange={debounce(handleEditorChange, 1000)}
                    ></OnChangeHTML>
                    <TextEditor className="px-1" />
                </Remirror>
            </ThemeProvider>
        </AllStyledComponent>
    );
};

export default SmallEditor;

const extensions = () => [
    new LinkExtension({ autoLink: true, openLinkOnClick: true }),
    new BoldExtension(),
    new StrikeExtension(),
    new ItalicExtension(),
    new HeadingExtension(),
    new BlockquoteExtension(),
    new BulletListExtension({ enableSpine: true }),
    new OrderedListExtension(),
    new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
    }),
    new CodeExtension(),
    new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
    new TrailingNodeExtension(),
    new TableExtension(),
    new MarkdownExtension({ copyAsMarkdown: false }),
    new HardBreakExtension(),
    new TextHighlightExtension(),
    new EmojiExtension({ data, moji: "openmoji", plainText: true }),
    new UnderlineExtension(),
    new HorizontalRuleExtension(),
    new DropCursorExtension(),
];
