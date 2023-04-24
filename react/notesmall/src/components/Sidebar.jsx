/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import AddnewDocument from "./AddnewDocument";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import CategoryTab from "./sidebar/CategoryTab";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";

const Sidebar = () => {
    let history = useNavigate();
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
                    css={css`
                        cursor: pointer;
                        display: flex;
                        padding: 2px;
                        padding-left: 3px;
                        padding-right: 100px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        &:hover {
                            background-color: #ECF1FE;
                            color: #1976d2;
                            font-weight: 700;
                        }
                        font-size: 15px;
                        align-items: center;
                        width: 100%;

                    `}
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
                    {/* <Button
                        variant="text"
                        color="warning"
                        onClick={() => history("/search")}
                        size="small"
                        css={css`
                            margin: 0 3px;
                            color: #1976d2 !important;

                            &:hover {
                                background-color: #f1f3f4;
                            }
                        `}
                        startIcon={<SearchIcon />}
                    >
                        Search
                    </Button> */}
                </div>
                <div
                    onClick={() => history("/tag")}
                    css={css`
                        cursor: pointer;
                        display: flex;
                        padding: 2px;
                        padding-left: 3px;
                        padding-right: 100px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        &:hover {
                            background-color: #ECF1FE;
                            color: #1976d2;
                            font-weight: 700;
                        }
                        font-size: 15px;
                        align-items: center;
                        width: 100%;


                    `}
                >
                    <TurnedInNotIcon
                        css={css`
                            margin-right: 5px;
                            color: #1976d2;
                            font-size: 18px;

                        `}
                    />
                    Tags
                    {/* <Button
                    variant="text"
                    color="warning"
                    onClick={() => history("/tag")}
                    size="small"
                    css={css`
                        margin: 0 3px;
                        color: black !important;
                        &:hover {
                            color: black !important;
                            background-color: #c5c5c5;
                        }
                    `}
                    startIcon={<TurnedInNotIcon />}
                >
                    Tag
                </Button> */}
                </div>
                <div
                    onClick={() => history("/project")}
                    css={css`
                        cursor: pointer;
                        display: flex;
                        padding: 2px;
                        padding-left: 3px;
                        padding-right: 100px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        &:hover {
                            background-color: #ECF1FE;
                            color: #1976d2;
                            font-weight: 700;
                        }
                        font-size: 15px;
                        align-items: center;
                        width: 100%;


                    `}
                >
                    <AccountTreeOutlinedIcon
                        css={css`
                            margin-right: 5px;
                            color:#1976d2;
                            font-size: 18px;
                            

                        `}
                    />
                    Projects
                    {/* <Button
                        variant="text"
                        color="warning"
                        onClick={() => history("/project")}
                        size="small"
                        css={css`
                            margin: 0 3px;
                            color: black !important;
                            &:hover {
                                color: black !important;
                                background-color: #c5c5c5;
                            }
                        `}
                        startIcon={<AccountTreeOutlinedIcon />}
                    >
                        Project
                    </Button> */}
                </div>
                <div
                    css={css`
                        cursor: pointer;
                        display: flex;
                        padding: 2px;
                        padding-left: 3px;
                        padding-right: 100px;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        &:hover {
                            background-color: #ECF1FE;
                            color: #1976d2;
                            font-weight: 700;
                        }
                        font-size: 15px;
                        align-items: center;
                        width: 100%;


                    `}
                >
                    <PostAddIcon
                        css={css`
                            margin-right: 5px;
                            color:#1976d2;
                            font-size: 18px;
                        `}
                    />
                    <AddnewDocument />
                </div>
            </div>
            {/* <Getlist /> */}
            <CategoryTab />
        </div>
    );
};

export default Sidebar;
