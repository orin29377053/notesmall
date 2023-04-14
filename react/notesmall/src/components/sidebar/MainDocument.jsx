/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ToggleList from "./unit/ToggleList";
const MainDocument = ({ deletedItems, archivedItems, allItems,recentItems}) => {
    const [status, setStatus] = React.useState({
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
            // subheader={
            //     <ListSubheader component="div" id="nested-list-subheader">
            //         Nested List Items
            //     </ListSubheader>
            // }
            css={css`
            color:black
            
            `}
        >
            <ToggleList
                onCLockAction={handleMainListClick}
                name={"Main"}
                Status={status.mainOpen}
                list={allItems}
                icon={<InboxIcon />}
            />
            <ToggleList
                onCLockAction={handleRecentListClick}
                name={"Recent"}
                Status={status.recentOpen}
                list={recentItems}
                icon={<InboxIcon />}
            />
            <ToggleList
                onCLockAction={handleArchiveListClick}
                name={"Archive"}
                Status={status.archiveOpen}
                list={archivedItems}
                icon={<InboxIcon />}
            />
            <ToggleList
                onCLockAction={handleDeleteListClick}
                name={"Delete"}
                Status={status.deleteOpen}
                list={deletedItems}
                icon={<InboxIcon />}
            />
        </List>
    );
};

export default MainDocument;
