import React from "react";
import ToggleList from "./unit/ToggleList";
import InboxIcon from "@mui/icons-material/MoveToInbox";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import List from "@mui/material/List";
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
const ProjectDocument = ({ projectlist }) => {
    const [openedProject, setOpenedProject] = React.useState(null);

    const handleListClick = (projectName) => {
        setOpenedProject(projectName === openedProject ? null : projectName);
    };
    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            css={css`
                color: black;
            `}
        >
            {projectlist
                ? projectlist.map((project) => (
                      <ToggleList
                          onClickAction={() => handleListClick(project.name)}
                          name={project.name}
                          Status={openedProject === project.name}
                          onCLockAction={handleListClick}
                          list={project.documents}
                          icon={<FolderCopyOutlinedIcon />}
                      />
                  ))
                : null}
        </List>
    );
};

export default ProjectDocument;
