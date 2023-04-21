/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import AddnewDocument from "./AddnewDocument";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryTab from "./sidebar/CategoryTab";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

const Sidebar = () => {
    let history = useNavigate();
    return (
        <div className="sidebar">
            <div
                css={css`
                    padding: 5px 20px;
                    border-bottom: 1px solid #E7EBF0;

                `}
            >
                <Button
                    variant="text"
                    color="warning"
                    onClick={() => history("/search")}
                    size="small"
                    css={css`
                        margin: 0 3px;
                        color: black !important;
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
                        color: black !important;
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
                        color: black !important;
                        &:hover {
                            color: black !important;
                            background-color: #c5c5c5;
                        }
                    `}
                    startIcon={<AccountTreeOutlinedIcon />}
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
