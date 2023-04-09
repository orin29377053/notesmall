/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import "../App.css";
import Getlist from "./Getlist";
import AddnewDocument from "./AddnewDocument";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
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
                        margin: 0 5px;
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
                <AddnewDocument />
            </div>
            <Getlist />
        </div>
    );
};

export default Sidebar;
