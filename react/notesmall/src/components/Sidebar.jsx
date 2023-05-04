/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import CategoryTab from "./sidebar/CategoryTab";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useDispatch, useSelector } from "react-redux";
import FolderList from "./sidebar/FolderList";

const Sidebar = () => {
    const { sidebar } = useSelector((state) => state.common);
    const { projectlist } = useSelector((state) => state.project);

    const deletedItems = sidebar?.filter((item) => item.isDeleted);
    const archivedItems = sidebar?.filter(
        (item) => item.isArchived && !item.isDeleted
    );
    const favoriteItems = sidebar?.filter(
        (item) => item.isFavorite && !item.isArchived && !item.isDeleted
    );
    const allItems = sidebar?.filter(
        (item) => !item.isArchived && !item.isDeleted
    );

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
                <div onClick={() => add()} className="sidebarTitle">
                    <PostAddIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 18px;
                        `}
                    />
                    New
                </div>
                <NavLink
                    className="sidebarTitle"
                    // onClick={() => history("/search")}
                    // activeClassName="sidebarActive"
                    to="/search"
                >
                    <SearchIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 18px;
                        `}
                    />
                    Search
                </NavLink>
                <NavLink to="/tag" className="sidebarTitle">
                    <TurnedInNotIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 18px;
                        `}
                    />
                    Tags
                </NavLink>
                <NavLink to="/project" className="sidebarTitle">
                    <div
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 14px;
                        `}
                    >
                        <i className="fa-regular fa-folder-open"></i>
                    </div>
                    Project Manager
                </NavLink>
            </div>
            <div
                css={css`
                    padding: 5px 15px;
                `}
            >
                <div
                    className="my-2"
                    css={css`
                        border-bottom: 1px solid #e7ebf0;
                    `}
                >
                    <FolderList
                        title={"All Documents"}
                        list={allItems}
                        openState={false}
                        logo={<i className="fa-solid fa-inbox"></i>}
                    />
                    <FolderList
                        title={"Favorite"}
                        list={favoriteItems}
                        openState={false}

                        logo={<i className="fa-solid fa-star"></i>}
                    />
                    
                </div>
                <div
                    className="my-2"
                    css={css`
                        border-bottom: 1px solid #e7ebf0;
                    `}
                >
                    <div
                        className="mb-2"
                        css={css`
                            font-size: 0.8rem;
                            color: #6c757d;
                        `}
                    >
                        Project
                    </div>
                    {projectlist?.map((project) => (
                        <FolderList
                            logo={<i className="fa-solid fa-bars-progress"></i>}
                            title={project.name}
                            list={project?.documents?.filter(
                                (doc) => !doc.isDeleted
                            )}
                            openState={false}
                        />
                    ))}
                </div>

                <FolderList
                    title={"Delete"}
                    list={deletedItems}
                    openState={false}
                    logo={<i className="fa-regular fa-trash-can"></i>}
                />
            </div>

            {/* <CategoryTab /> */}
        </div>
    );
};

export default Sidebar;
