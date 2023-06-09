import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import ListItem from "@mui/material/ListItem";
import { Link } from "react-router-dom";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Tooltip from "@mui/material/Tooltip";

const DocumentListItem = ({ list }) => {
    return list?.map((item) => (
        <Tooltip
            title={`Last updated: ${item.updated_at
                ?.slice(0, 19)
                .replace("T", " ")}`}
            arrow
            enterDelay={800}
            key={item._id}
        >
            <ListItem>
                <Link
                    to={`/${item._id}`}
                    css={css`
                        color: black;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 15px;
                        padding: 5px 10px;

                        width: 100%;
                        &:hover {
                            background-color: #ecf1fe;
                            color: #1976d2;
                            font-weight: 700 !important;
                        }
                        & > InsertDriveFileOutlinedIcon:hover {
                            background-color: #ecf1fe;
                            color: #1976d2;
                            font-weight: 700 !important;
                        }
                    `}
                >
                    <div
                        css={css`
                            display: flex;
                            align-items: center;
                            border-radius: 5px;

                            &:hover {
                                background-color: #ecf1fe;
                                color: #1976d2;
                                font-weight: 700 !important;
                            }
                        `}
                    >
                        <InsertDriveFileOutlinedIcon
                            fontSize="small"
                            sx={{
                                maxWidth: "20px",
                                marginRight: "5px",
                            }}
                        />
                        {item.title}
                    </div>
                </Link>
            </ListItem>
        </Tooltip>
    ));
};

export default DocumentListItem;
