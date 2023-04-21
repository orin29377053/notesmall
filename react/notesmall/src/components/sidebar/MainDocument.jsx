/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React,{useState} from "react";
import List from "@mui/material/List";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ToggleList from "./unit/ToggleList";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
const MainDocument = ({ deletedItems, archivedItems, allItems,recentItems}) => {
    const [status, setStatus] = useState({
        mainOpen: true,
        recentOpen: false,
        archiveOpen: false,
        deleteOpen: false,
    });

    const handleMainListClick = () => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            mainOpen: prevStatus.mainOpen ? false : true,
            recentOpen: false,
            archiveOpen: false,
            deleteOpen: false,
        }));
    };

    const handleRecentListClick = () => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            mainOpen: false,
            recentOpen: prevStatus.recentOpen ? false : true,
            archiveOpen: false,
            deleteOpen: false,
        }));
    };

    const handleArchiveListClick = () => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            mainOpen: false,
            recentOpen: false,
            archiveOpen: prevStatus.archiveOpen ? false : true,
            deleteOpen: false,
        }));
    };

    const handleDeleteListClick = () => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            mainOpen: false,
            recentOpen: false,
            archiveOpen: false,
            deleteOpen: prevStatus.deleteOpen ? false : true,
        }));
    };
    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            css={css`
            color:black
            
            `}
        >
            <ToggleList
                onClickAction={handleMainListClick}
                name={"Documents"}
                Status={status.mainOpen}
                list={allItems}
                icon={<FolderOpenIcon />}
            />
            <ToggleList
                onClickAction={handleRecentListClick}
                name={"Recent"}
                Status={status.recentOpen}
                list={recentItems}
                icon={<AccessTimeIcon />}
            />
            <ToggleList
                onClickAction={handleArchiveListClick}
                name={"Archive"}
                Status={status.archiveOpen}
                list={archivedItems}
                icon={<InboxIcon />}
            />
            <ToggleList
                onClickAction={handleDeleteListClick}
                name={"Delete"}
                Status={status.deleteOpen}
                list={deletedItems}
                icon={<DeleteOutlineIcon />}
            />
        </List>
    );
};

export default MainDocument;
