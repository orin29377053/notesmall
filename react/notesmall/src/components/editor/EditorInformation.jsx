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

const EditorInformation = () => {
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
    const[id,setId] = useState("")
    const favorite = async () => {
        const token = localStorage.getItem("token");

        setIsFavorite(!isFavorite);
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
        // console.log("qqq")
        // console.log("editingDocument", editingDocument)
        if (Object.keys(editingDocument).length !== 0) {
            setUpdated_at(getFormattedTime(editingDocument?.updated_at));
            setCreated_at(getFormattedTime(editingDocument?.created_at));
            setTitle(editingDocument?.title);
            setContentlength(editingDocument?.content.length||0);
            setImageslength(editingDocument?.images.length||0);
            setIsFavorite(editingDocument?.isFavorite);
            setIsDeleted(editingDocument?.isDeleted);
            setId(editingDocument?._id)
        }
    }, [editingDocument, path]);

    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                font-size: 1rem;
                border-radius: 10px;
                border: 1.5px solid #e0e0e0;
                padding: 10px;
                box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
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
                            src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
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
                    <div className="docInfoTitle">Counts</div>
                    <div
                        css={css`
                            overflow: hidden;
                        `}
                    >
                        {contentlength && contentlength}
                    </div>
                </div>
                <div className="docInfoBlock">
                    <div className="docInfoTitle">Images</div>
                    <div>{imageslength && imageslength}</div>
                </div>
                <div css={css`
                margin-left: auto;
                `}>
                                {isDeleted === false ? (
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
                                ) : (
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
                                            font-size: 12px;
                                            font-weight: 700;
                                        `}
                                    >
                                        Perment Delete
                                    </Button>
                                )}
                            </div>
            </div>
        </div>
    );
};

export default EditorInformation;
