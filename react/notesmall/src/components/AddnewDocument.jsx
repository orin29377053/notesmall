/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useEffect } from "react";
const AddnewDocument = () => {
    const dispatch = useDispatch();
    let history = useNavigate();

    const add = () => {
        dispatch({
            type: "CREATE_DOCUMENTS",
            payload: {
                gqlMethod: "mutation",
                api: "createDocument",
                format: `(document: {title: "new document",content: "new document"})`,
                response:
                    "_id title content updated_at tags{_id,name,colorCode} project{_id,name} isDeleted isFavorite isArchived ",
            },
            helper: { history },
        });
    };

    return (
        <Button
            variant="text"
            size="small"
            onClick={() => add(useSelector)}
            startIcon={<PostAddIcon />}
            css={css`
                color: black !important;

                &:hover {
                    color: black !important;
                    background-color: #c5c5c5;
                }
            `}
        >
            New
        </Button>
    );
};

export default AddnewDocument;
