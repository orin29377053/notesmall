import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { uuid } from "uuidv4";
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
                    `}
                >
                    <div
                        css={css`
                            display: flex;
                        `}
                    >
                        <ListItemIcon
                            css={css`
                                align-items: center;
                            `}
                            sx={{
                                maxWidth: "25px",
                                minWidth: "25px",
                            }}
                        >
                            <InsertDriveFileOutlinedIcon
                                fontSize="small"
                                sx={{
                                    maxWidth: "20px",
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                            css={css`
                                warpping: break-word;
                            `}
                        />
                    </div>

                    {/* <ListItemText
                    secondary={item.updated_at?.slice(0, 19).replace("T", " ")}
                /> */}
                </Link>
            </ListItem>
        </Tooltip>
    ));
};

export default DocumentListItem;
