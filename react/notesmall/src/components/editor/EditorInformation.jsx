/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from "react";
import { getFormattedTime } from "../../utils/timehandling";
import { useSelector, useDispatch } from "react-redux";
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarRateIcon from "@mui/icons-material/StarRate";
import { graphqlAPI } from "../../utils/const";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import ProjectSelector from "./ProjectSelector";
import getTextColorFromBackground from "../../utils/getTextColorFromBackground";
import Chip from "@mui/material/Chip";
import TagContent from "./TagContent";
import TOC from "./TOC";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HelpIcon from "@mui/icons-material/Help";
import markdownHandler from "../../utils/markdownHandler";
import Tooltip from "@mui/material/Tooltip";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 3,

    // border: "2px solid #000",
    boxShadow: 10,
    p: 3,
};
const EditorInformation = ({
    currentHtmlsaveToreducer,
    tracingDoc,
    pathID,
    reducerID,
    isEditable,
}) => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const { editingDocument } = useSelector((state) => state.editor);
    const { path } = useSelector((state) => state.common);
    const [updated_at, setUpdated_at] = useState("");
    const [created_at, setCreated_at] = useState("");
    const [title, setTitle] = useState("");
    const [contentlength, setContentlength] = useState("");
    const [imageslength, setImageslength] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [id, setId] = useState("");
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const favorite = async () => {
        currentHtmlsaveToreducer();
        const token = localStorage.getItem("token");

        const query = `
                mutation{
                    updatedDocument(document: { _id: "${
                        editingDocument._id
                    }",isFavorite: ${!isFavorite} }) {
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
        dispatch({
            type: "UPDATE_FAVORITE",
            payload: { id: editingDocument._id, isFavorite: !isFavorite },
        });

        

        dispatch({
            type: "FETCH_RESULT_INFORMATION",
            data: {
                type: "success",
                message:
                    !isFavorite === true
                        ? "Add to favorite success"
                        : "Remove from favorite success",
                title: "Success",
            },
        });

        setIsFavorite(!isFavorite);
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
    const Restore = (dispatch, id) => {
        dispatch({
            type: "RESTORE_SIDEBAR_LIST",
            payload: {
                gqlMethod: "mutation",
                api: "deleteDocument",
                format: `(document:{ _id: "${id}" ,isDeleted: false})`,
                response: "_id ",
            },
        });
        // history("/");
    };
    const PermentDelete = (dispatch, id) => {
        dispatch({
            type: "PERMENT_DELETE_DOCUMENT",
            payload: {
                gqlMethod: "mutation",
                api: "permanentDeleteDocument",
                format: `(id:"${id}")`,
                response: "_id",
            },
        });
        history("/");
    };

    useEffect(() => {
        if (Object.keys(editingDocument).length !== 0) {
            setUpdated_at(getFormattedTime(editingDocument?.updated_at));
            setCreated_at(getFormattedTime(editingDocument?.created_at));
            setTitle(editingDocument?.title);
            // setContentlength(markdownHandler(editingDocument?.content).length-1|| 0);
            setImageslength(editingDocument?.images.length || 0);
            setIsFavorite(editingDocument?.isFavorite);
            setIsDeleted(editingDocument?.isDeleted);
            setId(editingDocument?._id);
            setTags(editingDocument?.tags);
        }
    }, [editingDocument, path]);



    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                font-size: 1rem;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

                padding: 15px;
            `}
        >
            <div
                css={css`
                    display: flex;
                    align-items: center;
                `}
            >
                <InfoOutlinedIcon
                    css={css`
                        color: #1976d2;
                        margin-right: 5px;
                    `}
                />
                Document Information
                <div
                    css={css`
                        margin-left: auto;
                        cursor: pointer;
                    `}
                >
                    {isEditable ? (
                        isFavorite === false ? (
                            <StarBorderIcon
                                size="large"
                                onClick={favorite}
                                css={css`
                                color: #faaf00;
                                :hover {
                                    transform: scale(1.2);
                                    `}
                            />
                        ) : (
                            <StarRateIcon
                                size="large"
                                css={css`
                                    color: #faaf00;
                                    :hover {
                                        transform: scale(1.2);
                                        `}
                                onClick={favorite}
                            />
                        )
                    ) : (
                        <Tooltip title="This document has been deleted">
                            <div
                                css={css`
                                    color: gray;
                                `}
                            >
                                <i className="fa-regular fa-trash-can"></i>
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div
                css={css`
                    margin-left: 10px;
                    margin-top: 5px;
                    display: flex;
                    flex-direction: column;
                `}
            >
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Title</div>
                    <div>{title && title}</div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Author</div>
                    <div>
                        <Avatar
                            alt="Orin"
                            src="https://image.notesmall.site/resized-mypic.jpeg"
                            sx={{ width: 30, height: 30 }}
                        />
                    </div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Created at</div>
                    <div>{created_at && created_at}</div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Updated at</div>
                    <div>{updated_at && updated_at}</div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Project</div>
                    <div>
                        <ProjectSelector
                            currentHtmlsaveToreducer={currentHtmlsaveToreducer}
                            isEditable={isEditable}
                        />
                    </div>
                </div>
                <div
                    className="docInfoBlock"
                    css={css`
                        align-items: flex-start;
                    `}
                >
                    <div className="docInfoTitle">Tags</div>
                    <div
                        css={css`
                            display: flex;
                            flex-wrap: wrap;
                        `}
                    >
                        {tags?.map((item) => (
                            <Chip
                                key={item._id}
                                label={item.name}
                                size="small"
                                css={css`
                                    background-color: ${item.colorCode};
                                    margin: 2px;
                                    padding: 1px;
                                    font-weight: 700;
                                    color: ${getTextColorFromBackground(
                                        item.colorCode.slice(1)
                                    )};
                                `}
                                variant="outlined"
                            />
                        ))}
                        {isEditable ? (
                            <TagContent
                                currentHtmlsaveToreducer={
                                    currentHtmlsaveToreducer
                                }
                            />
                        ) : null}
                    </div>
                </div>

                <div className="docInfoBlock">
                    <div className="docInfoTitle">
                        Images
                        <Tooltip
                            title="This will fetch the images in the document. If it doesn't fetch automatically, please try refreshing the page."
                            css={css`
                                cursor: pointer;
                                margin-left: 5px;
                            `}
                        >
                            <HelpIcon sx={{ fontSize: "12px" }} />
                        </Tooltip>
                    </div>
                    <div>{imageslength && imageslength}</div>
                </div>
                <div
                    className="docInfoBlock"
                    css={css`
                        align-items: flex-start;
                    `}
                >
                    <div className="docInfoTitle">
                        Heading
                        <Tooltip
                            title="This will fetch the headings ( h1, h2,...) in the document. If it doesn't fetch automatically, please try refreshing the page."
                            css={css`
                                cursor: pointer;
                                margin-left: 5px;
                            `}
                        >
                            <HelpIcon sx={{ fontSize: "12px" }} />
                        </Tooltip>
                    </div>
                    <div>
                        <TOC
                            tracingDoc={tracingDoc}
                            pathID={pathID}
                            reducerID={reducerID}
                        />
                    </div>
                </div>
            </div>

            {isDeleted === false ? (
                <div
                    css={css`
                        margin-left: auto;
                        cursor: pointer;
                    `}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            Delete(dispatch, id);
                        }}
                        startIcon={<DeleteIcon />}
                        size="small"
                        css={css`
                            border-radius: 20px;
                            font-size: 0.5rem;
                            font-weight: 700;
                        `}
                    >
                        Delete
                    </Button>
                </div>
            ) : (
                <div
                    css={css`
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 10px;
                    `}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            Restore(dispatch, id);
                        }}
                        startIcon={<AutorenewIcon />}
                        size="small"
                        css={css`
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 700;
                        `}
                    >
                        Restore
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            // PermentDelete(dispatch, id);
                            setOpen(true);
                        }}
                        startIcon={<DeleteIcon />}
                        size="small"
                        css={css`
                            border-radius: 20px;
                            font-size: 1px;
                            font-weight: 700;
                        `}
                    >
                        Permanent
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div
                                css={css`
                                    margin-right: 5px;
                                    font-size: 20px;
                                    font-weight: 700;
                                    margin-bottom: 10px;
                                `}
                            >
                                This action cannot be undone
                            </div>
                            <div
                                css={css`
                                    font-size: 14px;
                                    color: #8f9a97;
                                    margin-right: 5px;

                                    margin-bottom: 10px;
                                `}
                            >
                                This document will be deleted permanently and
                                cannot be recovered.
                            </div>
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                `}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                    size="small"
                                    css={css`
                                        border-radius: 20px;
                                        font-size: 1px;
                                        font-weight: 700;
                                    `}
                                >
                                    cancel
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => {
                                        PermentDelete(dispatch, id);
                                        setOpen(false);
                                    }}
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                    css={css`
                                        border-radius: 20px;
                                        font-size: 1px;
                                        font-weight: 700;
                                    `}
                                >
                                    yes
                                </Button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default EditorInformation;
