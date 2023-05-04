/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from "react";
import { getFormattedTime } from "../../utils/timehandling";
import { useSelector, useDispatch } from "react-redux";
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
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
import markdownHandler from "../../utils/markdownHandler";
const EditorInformation = ({
    currentHtmlsaveToreducer,
    tracingDoc,
    pathID,
    reducerID,
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
                message: !isFavorite===true?"Add to favorite success":"Remove from favorite success",
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
                api: "permantDeleteDocument",
                format: `(id:"${id}")`,
                response: "_id",
            },
        });
        history("/");
    };

    useEffect(() => {
        // console.log("qqq")
        console.log("editingDocument", editingDocument)
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
            console.log(markdownHandler(editingDocument?.content));
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
                    {isFavorite === false ? (
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
                    <div className="docInfoTitle">Update at</div>
                    <div>{updated_at && updated_at}</div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Project</div>
                    <div>
                        <ProjectSelector
                            currentHtmlsaveToreducer={currentHtmlsaveToreducer}
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
                        <TagContent
                            currentHtmlsaveToreducer={currentHtmlsaveToreducer}
                        />
                    </div>
                </div>
                {/* <div className="docInfoBlock">
                    <div className="docInfoTitle">Counts</div>
                    <div
                        css={css`
                            overflow: hidden;
                        `}
                    >
                        {contentlength && contentlength}
                    </div>
                </div> */}
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Images</div>
                    <div>{imageslength && imageslength}</div>
                </div>
                <div
                    className="docInfoBlock"
                    css={css`
                        align-items: flex-start;
                    `}
                >
                    <div className="docInfoTitle">Content</div>
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
                            PermentDelete(dispatch, id);
                        }}
                        startIcon={<DeleteIcon />}
                        size="small"
                        css={css`
                            border-radius: 20px;
                            font-size: 1px;
                            font-weight: 700;
                        `}
                    >
                        Perment
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EditorInformation;
