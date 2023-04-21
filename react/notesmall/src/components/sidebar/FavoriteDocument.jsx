import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DocumentListItem from "./unit/DocumentListItem";

const FavoriteDocument = ({ list }) => {
    return (
        <List dense={true}>
            <DocumentListItem list={list} />
        </List>
    );
};

export default FavoriteDocument;
