/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import CategoryTab from "./sidebar/CategoryTab";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useDispatch } from "react-redux";

const Sidebar = () => {
    let history = useNavigate();
    const dispatch = useDispatch();
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
        <div className="sidebar">
            <div
                css={css`
                    padding: 5px 10px;
                    border-bottom: 1px solid #e7ebf0;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    align-items: flex-start;
                `}
            >
                <div
                    className="sidebarTitle"
                    onClick={() => history("/search")}
                >
                    <SearchIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                        font-size: 18px;
                        

                        `}
                    />
                    Search
                </div>
                <div
                    onClick={() => history("/tag")}
                    className="sidebarTitle"
                    
                >
                    <TurnedInNotIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 18px;

                        `}
                    />
                    Tags
                </div>
                <div
                    onClick={() => history("/project")}
                    className="sidebarTitle"
                    
                >
                    <AccountTreeOutlinedIcon
                        css={css`
                            margin-right: 5px;
                            color:#1976d2;
                            font-size: 18px;
                            

                        `}
                    />
                    Projects
                </div>
                <div
                    onClick={() => add()}
                    className="sidebarTitle"
                    
                >
                    <PostAddIcon
                        css={css`
                            margin-right: 5px;
                            color:#1976d2;
                            font-size: 18px;
                        `}
                    />
                    New
                </div>
            </div>
            <CategoryTab />
        </div>
    );
};

export default Sidebar;
