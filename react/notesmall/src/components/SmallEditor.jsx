/** @jsxImportSource @emotion/react */
import "remirror/styles/all.css";
import React, { useCallback, useMemo, useState } from "react";
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
import "../App.css";
import { Button, Alert, AlertTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import Badge from "@mui/material/Badge";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TagSelector from "./TagSelector";

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
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const TagContent = () => {
    // const { taglist } = useSelector((state) => state.tag);
    const { editingDocument } = useSelector((state) => state.editor);
    const tagLength = editingDocument?.tags?.length || 0;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Badge
                badgeContent={tagLength}
                color="secondary"
                css={css`
                    margin-left: 10px;
                `}
                onClick={handleOpen}
            >
                <TurnedInNotIcon color="action" />
            </Badge>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TagSelector setOpen={setOpen} />
                </Box>
            </Modal>
        </div>
    );
};

const MdToContent = ({ htmlContents }) => {
    const { setContent } = useRemirrorContext();
    setContent(htmlContents);
    return;
};
const TextEditor = () => {
    const { getRootProps } = useRemirrorContext();

    return <div {...getRootProps()} />;
};

const SmallEditor = () => {
    let history = useNavigate();

    const { id } = useParams();
    console.log(id);
    const dispatch = useDispatch();
    const { editingDocument } = useSelector((state) => state.editor);
    const title = editingDocument?.title;
    const content = editingDocument?.content;

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

        dispatch({ type: "UPDATE_CONTENT", payload: { content: markdown } });
        dispatch({
            type: "UPTATE_SIDE_BAR_LIST",
            payload: {
                _id: id,
                title: title,
                updated_at: new Date().toISOString(),
            },
        });
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

    const getEssay = (id) => {
        console.log("getid");
        if (id) {
            dispatch({
                type: "QUERY_DOCUMENTS",
                payload: {
                    gqlMethod: "query",
                    api: "document",
                    format: `(id:"${id}")`,
                    response:
                        "_id title content updated_at tags{_id,name,colorCode} ",
                },
            });
        }
    };

    useEffect(() => {
        getEssay(id);
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode document{_id title content}",
            },
        });
    }, [id]);

    const changeTitle = useCallback(
        debounce((id, title) => {
            if (title) {
                dispatch({
                    type: "EDIT_TITLE",
                    payload: {
                        gqlMethod: "mutation",
                        api: "updatedDocument",
                        format: `(document:{ _id: "${id}", title: "${title}" })`,
                        response: "title content",
                    },
                });
                // dispatch({ type: "JUST_UPTATE_SIDE_BAR_LIST"});
                dispatch({
                    type: "UPTATE_SIDE_BAR_LIST",
                    payload: {
                        _id: id,
                        title: title,
                        updated_at: new Date().toISOString(),
                    },
                });
            } else {
                console.log("no dispatch");
            }
        }, 500),
        []
    );

    useEffect(() => {
        title && changeTitle(id, title);
    }, [title, changeTitle]);

    return (
        <AllStyledComponent>
            {/* the className is used to define css variables necessary for the editor */}

            <ThemeProvider>
                <div
                    css={css`
                        margin: 2px;
                        display: flex;
                    `}
                >
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            Delete(dispatch, id);
                        }}
                        startIcon={<DeleteIcon />}
                        size="small"
                    >
                        Delete
                    </Button>
                    <TagContent />
                </div>

                <Remirror
                    manager={manager}
                    initialContent={state}
                    // hooks={hooks}
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
                                        type: "UPDATE_TITLE",
                                        payload: { title: e.target.value },
                                    });
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
                        onChange={debounce(handleEditorChange, 3000)}
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
