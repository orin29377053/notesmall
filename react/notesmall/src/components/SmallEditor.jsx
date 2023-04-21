/** @jsxImportSource @emotion/react */
import "remirror/styles/all.css";
import React, {
    useCallback,

    useRef,
    useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import data from "svgmoji/emoji.json";
import debounce from "lodash.debounce";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority } from "remirror";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { useSelector, useDispatch } from "react-redux";
import TurndownService from "turndown";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import uploadHandler from "../utils/uploadHandler";
import TagContent from "./editor/TagContent";
import ProjectSelector from "./editor/ProjectSelector";
import TOC from "./editor/TOC";
import showdown from "showdown";
import { graphqlAPI } from "../utils/const";
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
    useRemirror,
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
    OnChangeHTML,
} from "@remirror/react";

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

const MdToContent = ({ htmlContents }) => {
    const { setContent } = useRemirrorContext();
    if (!htmlContents) return;
    setContent(htmlContents);
    return;
};
const TextEditor = () => {
    const { getRootProps } = useRemirrorContext();

    return <div {...getRootProps()} />;
};

const SmallEditor = () => {
    const { editingDocument } = useSelector((state) => state.editor);
    const { path } = useSelector((state) => state.common);
    const { id } = useParams();

    const location = useLocation();
    let history = useNavigate();
    const dispatch = useDispatch();

    const title = editingDocument?.title;
    const rawContent = editingDocument?.content;
    const newID = editingDocument?._id;
    const isDeleted = editingDocument?.isDeleted;

    const refVContent = useRef({ id: "", html: "" });
    const refUploading = useRef(true);

    const token = localStorage.getItem("token");

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

    const currentHtmlsaveToreducer = () => {
        const turndownService = new TurndownService({
            // keep: 'code[data-language]',
            codeBlockStyle: "fenced",
            fence: "```",
        });
        const marked = turndownService.turndown(refVContent.current.html);
        dispatch({
            type: "UPDATE_CONTENT",
            payload: { id: refVContent.current.id, content: marked },
        });
    };
    const currentTitleSaveToreducer = (title) => {
        dispatch({
            type: "UPDATE_TITLE",
            payload: {
                id: refVContent.current.id,
                title: title,
            },
        });
    };

    const handleEditorChange = async (html) => {
        refUploading.current = false;
        refVContent.current.html = html;
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
        await fetch(graphqlAPI, {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
        });
        refUploading.current = true;
    };

    const Delete = (dispatch, id) => {
        dispatch({
            type: "DELETE_SIDEBAR_LIST",
            payload: {
                gqlMethod: "mutation",
                api: "deleteDocument",
                format: `(document:{ _id: "${id}" ,isDeleted: true})`,
                response: "_id ",
            },
        });
        history("/");
    };
    const PermentDelete = (dispatch, id) => {
        dispatch({
            type: "PERMENT_DELETE_DOCUMENT",
            payload: {
                gqlMethod: "mutation",
                api: "permantDeleteDocument",
                format: `(id:"${id}")`,
                response: "_id ",
            },
        });
        history("/");
    };

    useEffect(() => {
        const pathID = path.replace(/\//g, "");
        // console.log("pathID", pathID);
        if (id !== newID) {
            console.log(id, newID, pathID);
            console.log("start sync ");
            dispatch({
                type: "QUERY_DOCUMENTS",
                payload: {
                    gqlMethod: "query",
                    api: "document",
                    format: `(id:"${id}")`,
                    response:
                        "_id title content updated_at tags{_id,name,colorCode} project{_id,name} isDeleted isFavorite isArchived ",
                },
            });
        } else if (id === newID) {
            console.log(id, newID, pathID);

            console.log("sync success");
            refVContent.current.id = newID;
            const converter = new showdown.Converter();
            const html = converter.makeHtml(rawContent);
            refVContent.current.html = html;
        }
    }, [id, newID, path]);

    const changeTitle = useCallback(
        debounce((id, title) => {
            if (id === newID && title) {
                console.log("update");
                dispatch({
                    type: "EDIT_TITLE",
                    payload: {
                        gqlMethod: "mutation",
                        api: "updatedDocument",
                        format: `(document:{ _id: "${id}", title: "${title}" })`,
                        response:
                            "_id title content updated_at isDeleted isFavorite isArchived",
                    },
                });
                refUploading.current = true;
            } else {
                console.log("no dispatch");
            }
        }, 500),
        [newID]
    );

    useEffect(() => {
        if (id === newID) {
            title && changeTitle(id, title);
        }
    }, [title, changeTitle]);

    useEffect(() => {
        const turndownService = new TurndownService({
            // keep: 'code[data-language]',
            codeBlockStyle: "fenced",
            fence: "```",
        });
        const marked = turndownService.turndown(refVContent.current.html);
        dispatch({
            type: "UPDATE_CONTENT",
            payload: { id: refVContent.current.id, content: marked },
        });
    }, [location]);

    return (
        <AllStyledComponent>
            {/* <div>{refUploading.current ? "sync" : "not sync"}</div> */}
            <ThemeProvider>
                <Row className="pb-3">
                    <Col md={9}>
                        <Remirror manager={manager} initialContent={state}>
                            <Row className="px-3 mb-2 mt-3">
                                <input
                                    type="text"
                                    // defaultValue={title}
                                    value={title}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            refUploading.current = false;
                                            currentHtmlsaveToreducer();
                                            currentTitleSaveToreducer(
                                                e.target.value
                                            );
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
                            <MdToContent htmlContents={rawContent} />
                            <OnChangeHTML
                                onChange={debounce(handleEditorChange, 500)}
                            ></OnChangeHTML>
                            <TextEditor className="px-1" />
                        </Remirror>
                    </Col>
                    <Col
                        md={3}
                        css={css`
                            border-left: 1px solid #ccc;
                            display: flex;
                            flex-direction: column;
                        `}
                    >
                        <div
                            css={css`
                                margin: 5px;
                                display: flex;
                                flex-direction: column;
                                align-items: flex-start;
                            `}
                        >
                            {isDeleted === false ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        Delete(dispatch, id);
                                    }}
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                >
                                    Delete
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        PermentDelete(dispatch, id);
                                    }}
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                >
                                    PermentDelete
                                </Button>
                            )}
                            <TagContent
                                currentHtmlsaveToreducer={
                                    currentHtmlsaveToreducer
                                }
                            />
                            <ProjectSelector
                                currentHtmlsaveToreducer={
                                    currentHtmlsaveToreducer
                                }
                            />
                        </div>
                        <TOC
                            tracingDoc={refVContent.current.html}
                            pathID={id}
                            reducerID={newID}
                        />
                    </Col>
                </Row>
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
