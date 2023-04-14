/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import "../App.css";
import Getlist from "./Getlist";
import AddnewDocument from "./AddnewDocument";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryTab from "./sidebar/CategoryTab";
const Sidebar = () => {
    let history = useNavigate();
    return (
        <div className="sidebar">
            <div
                css={css`
                    padding: 5px 20px;
                    border-bottom: 1px solid #494949;
                `}
            >
                <Button
                    variant="text"
                    color="warning"
                    onClick={() => history("/search")}
                    size="small"
                    css={css`
                        margin: 0 3px;
                        color: white !important;
                        &:hover {
                            color: black !important;
                            background-color: #c5c5c5;
                        }
                    `}
                    startIcon={<SearchIcon />}
                >
                    Search
                </Button>
                
                <Button
                    variant="text"
                    color="warning"
                    onClick={() => history("/tag")}
                    size="small"
                    css={css`
                        margin: 0 3px;
                        color: white !important;
                        &:hover {
                            color: black !important;
                            background-color: #c5c5c5;
                        }
                    `}
                    startIcon={<TurnedInNotIcon />}
                >
                    Tag
                </Button>
                <Button
                    variant="text"
                    color="warning"
                    onClick={() => history("/project")}
                    size="small"
                    css={css`
                        margin: 0 3px;
                        color: white !important;
                        &:hover {
                            color: black !important;
                            background-color: #c5c5c5;
                        }
                    `}
                    startIcon={<AccountTreeIcon />}
                >
                    Project
                </Button>
                <AddnewDocument />
            </div>
            {/* <Getlist /> */}
            <CategoryTab />
        </div>
    );
};

export default Sidebar;
