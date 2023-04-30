/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Nav, Collapse, Badge } from "react-bootstrap";
import { Tooltip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const FolderList = ({
    title = "Favorite",
    list = [],
    openState = true,
    logo,
}) => {
    const [open, setOpen] = useState(openState);
    let history = useNavigate();

    return (
        <div className="mb-2">
            <div
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                className="mb-1"
                css={css`
                    font-size: 0.9rem;
                    color: #6c757d;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                `}
            >
                <div className="singleLine pe-1">
                    {logo}&ensp;
                    {title}
                </div>
                <div
                    className="d-flex"
                    css={css`
                        align-items: center;
                    `}
                >
                    <Badge
                        className="me-2"
                        css={css`
                            background-color: #c9c9c9 !important;
                            padding: 3px 5px;
                        `}
                    >
                        <small>{list?.length}</small>
                    </Badge>
                    {open ? (
                        <i className="fa-solid fa-angle-down fa-sm"></i>
                    ) : (
                        <i className="fa-solid fa-angle-up fa-sm"></i>
                    )}
                </div>
            </div>
            <Collapse in={open}>
                <div
                    id="example-collapse-text"
                    className="ms-3"
                    css={css`
                        font-size: 0.9rem;
                    `}
                >
                    {list?.map((item) => (
                        <Tooltip
                            title={item.title}
                            placement="right"
                            key={item._id}
                        >
                            <div
                                onClick={() => {
                                    history(`/${item._id}`);
                                }}
                                className="mb-1 singleLine"
                                css={css`
                                    cursor: pointer;
                                    color: #58595a;
                                    :hover {
                                        color: #1a77d3;
                                        font-weight: 600;
                                    }
                                `}
                            >
                                <i className="fa-regular fa-file-lines"></i>
                                &ensp;
                                {item.title}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

export default FolderList;
