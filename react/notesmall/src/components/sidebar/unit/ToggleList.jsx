import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DocumentListItem from "./DocumentListItem";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
const ToggleList = ({ onClickAction, Status, list, icon, name }) => {
    return (
        <div
            css={css`
                padding: 0;
            `}
        >
            <ListItemButton
                onClick={onClickAction}
                dense={true}
                css={css`
                    padding: 1px;
                    margin-bottom: 1px;
                    margin-top: 5px;
                `}
                divider={true}
            >
                <ListItemIcon
                    sx={{
                        minWidth: "18px",
                        pl: 1,
                        mr: 1
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText primary={name} />
                {Status ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={Status} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    dense={true}
                    disablePadding
                    sx={{ pl: 0 }}
                >
                    <DocumentListItem
                        list={list}
                        
                    />
                </List>
            </Collapse>
        </div>
    );
};

export default ToggleList;
