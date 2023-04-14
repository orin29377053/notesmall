import React from "react";

import DocumentListItem from "./DocumentListItem";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
const ToggleList = ({ onCLockAction, Status, list ,icon,name}) => {
    return (
        <>
            <ListItemButton onClick={onCLockAction} >
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={name} />
                {Status ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={Status} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                    <DocumentListItem list={list} />
                </List>
            </Collapse>
        </>
    );
};

export default ToggleList;
