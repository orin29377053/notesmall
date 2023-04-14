import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { uuid } from "uuidv4";

const DocumentListItem = ({ list }) => {
    console.log("list", list);
    return list?.map((item) => (
        <ListItem>
            <Link to={`/${item._id}`} css={css`
            color: black;
            text-decoration: none;
            
            `}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText
                    primary={item.title}
                    secondary={item.updated_at}
                />
            </Link>
        </ListItem>
    ));
};

export default DocumentListItem;
