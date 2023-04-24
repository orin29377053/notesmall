/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
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
                "_id title content updated_at created_at tags{_id,name,colorCode} project{_id,name} isDeleted isFavorite isArchived images{ url}",
            },
            helper: { history },
        });
    };

    return (
        <div onClick={() => add(useSelector)}>
New
        {/* <Button
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
        </Button> */}
        </div>
    );
};

export default AddnewDocument;
