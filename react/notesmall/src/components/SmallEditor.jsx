/** @jsxImportSource @emotion/react */
import React, { useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { css } from "@emotion/react";
import debounce from "lodash.debounce";
import { AllStyledComponent } from "@remirror/styles/emotion";
import { useSelector, useDispatch } from "react-redux";
import TurndownService from "turndown";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import TagContent from "./editor/TagContent";
import ProjectSelector from "./editor/ProjectSelector";
import TOC from "./editor/TOC";
import Chip from "@mui/material/Chip";
import getTextColorFromBackground from "../utils/getTextColorFromBackground";
import EditorInformation from "./editor/EditorInformation";
import showdown from "showdown";
import { Extension, EditorToolbar } from "./editor/extension/Extension";
import { graphqlAPI } from "../utils/const";
import { createTheme, styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

import "remirror/styles/all.css";
import {
    Remirror,
    useRemirror,
    useRemirrorContext,
    OnChangeHTML,
    ThemeProvider,
} from "@remirror/react";

const theme = createTheme({
    palette: {
        primary: {
            // light: 如果省略將從 palette.primary.main 依照 tonalOffset 的值去計算
            main: "#1976d2",
            // dark: 如果省略將從 palette.primary.main 依照 tonalOffset 的值去計算,
            // contrastText: 如果省略將從 palette.primary.main 依照 contrastThreshold 的值去計算
        },
        secondary: {
            light: "#ff0000",
            main: "#ff0000",
            // dark: 如果省略將從 palette.secondary.main 的值去計算,
            contrastText: "#ff0000",
        },
        // 這裡的值將會影響未定義的contrastText的計算結果
        contrastThreshold: 3,
        // “tonalOffset”值可以是 0 到 1 之間的數字，這將適用於淺色和深色變體
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});
const Title = ({ currentHtmlsaveToreducer }) => {
    const [oldtitle, setTitle] = useState("");
    const { editingDocument } = useSelector((state) => state.editor);
    const { id } = useParams();
    const dispatch = useDispatch();
    const currentTitleSaveToreducer = (title) => {
        dispatch({
            type: "UPDATE_TITLE",
            payload: {
                title: title,
            },
        });
    };

    const handleChange = (e) => {
        setTitle(e.target.value);
        if (e.target.value) {
            debounce_title(e.target.value);
        }
    };

    const debounce_title = useCallback(
        debounce((searchVal) => {
            currentTitleSaveToreducer(searchVal);
            currentHtmlsaveToreducer();
            dispatch({
                type: "EDIT_TITLE",
                payload: {
                    gqlMethod: "mutation",
                    api: "updatedDocument",
                    format: `(document:{ _id: "${id}", title: "${searchVal}" })`,
                    response:
                        "_id title content updated_at isDeleted isFavorite isArchived",
                },
            });
        }, 500),
        [id]
    );

    useEffect(() => {
        setTitle(editingDocument.title);
    }, [editingDocument]);

    return (
        <input
            type="text"
            // defaultValue={title}
            value={oldtitle}
            placeholder="Please enter title"
            onChange={handleChange}
            css={css`
                padding: 0.25rem;
                border: none;
                border-bottom: 1px solid #ccc;
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1rem;
            `}
        ></input>
    );
};

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
    const [isloading, setIsloading] = useState(true);

    const location = useLocation();
    let history = useNavigate();
    const dispatch = useDispatch();

    const title = editingDocument?.title;
    const rawContent = editingDocument?.content;
    const newID = editingDocument?._id;

    const refVContent = useRef({ id: "", html: "" });
    const refUploading = useRef(true);
    const [oldtitle, setTitle] = useState("");

    const { manager, state } = useRemirror({
        extensions: Extension,
        content: "",
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
        if (refVContent.current.id === id) {
            dispatch({
                type: "UPDATE_TITLE",
                payload: {
                    id: refVContent.current.id,
                    title: title,
                },
            });
        }
    };

    const handleEditorChange = async (html) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch({ type: "LOGOUT" });
            history("/home");
            return;
        }

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
                        updatedDocumentContent(id: "${id}",content: """${markdown}""" ) }
                        `;
        const resul = await fetch(graphqlAPI, {
            method: "POST",
            body: JSON.stringify({ query }),
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
        });
        const result = await resul.json();
        if (!result.data.updatedDocumentContent) {
            alert("Update error");
        }
        refUploading.current = true;
    };

    useEffect(() => {
        if (!rawContent) {
            return;
        }
        refVContent.current.id = id;
        const converter = new showdown.Converter();
        const html = converter.makeHtml(rawContent);
        refVContent.current.html = html;
    }, [rawContent, id]);

    useEffect(() => {
        dispatch({
            type: "QUERY_DOCUMENTS",
            payload: {
                gqlMethod: "query",
                api: "document",
                format: `(id:"${id}")`,
                helper:{history},
                response:
                    "_id title content updated_at created_at tags{_id,name,colorCode} project{_id,name} isDeleted isFavorite isArchived images{ url autoTags}",
            },
        });
    }, [id]);

    useEffect(() => {
        if (newID !== id) {
            setIsloading(true);
        } else {
            setIsloading(false);
        }
    }, [newID, id]);

    useEffect(() => {
        setTitle(editingDocument.title);
    }, [editingDocument]);

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
    }, [location, path]);

    return (
        <>
            {isloading ? (
                <div
                    css={css`
                        margin: auto 0;
                        width: 100%;
                        height: 80vh;
                        display: flex;
                        flex-direction: column;


                    `}
                >
                    <CircularProgress
                        css={css`
                            margin: auto 0;
                            align-self: center;
                            width: 100%;
                        `}
                    />
                </div>
            ) : (
                <div className="editArea">
                    <div className="editPart">
                        <ThemeProvider>
                            <Remirror manager={manager} initialContent={state} placeholder={`What's on your mind?`}>
                                <Row className="px-3 mb-2 mt-3">
                                    <Title
                                        currentHtmlsaveToreducer={
                                            currentHtmlsaveToreducer
                                        }
                                    />
                                </Row>

                                <Row
                                    className="px-1 mb-4"
                                    css={css`
                                        font-size: 0.9rem;
                                    `}
                                >
                                    <EditorToolbar />
                                </Row>
                                <MdToContent htmlContents={rawContent} />
                                <OnChangeHTML
                                    onChange={debounce(handleEditorChange, 500)}
                                ></OnChangeHTML>
                                <TextEditor className="px-1" />
                            </Remirror>
                        </ThemeProvider>
                    </div>
                    <div
                        className="editMenu"
                        md={3}
                        css={css`
                            display: flex;
                            flex-direction: column;
                            margin-top: 1rem;
                            margin-right: 2px;
                            padding-right: 20px;
                        `}
                    >
                        <div
                            css={css`
                                display: flex;
                                flex-direction: column;
                                align-items: flex-start;
                            `}
                        >
                            <div
                                css={css`
                                    width: 100%;
                                `}
                            >
                                <EditorInformation
                                    currentHtmlsaveToreducer={
                                        currentHtmlsaveToreducer
                                    }
                                    tracingDoc={refVContent.current.html}
                                    pathID={id}
                                    reducerID={newID}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
    // <AllStyledComponent>
};

export default SmallEditor;
