/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import Box from "@mui/material/Box";
import TagSelector from "./TagSelector";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Modal, IconButton } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 5,
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const TagContent = ({ currentHtmlsaveToreducer }) => {
    const { editingDocument } = useSelector((state) => state.editor);
    const tagLength = editingDocument?.tags?.length || 0;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton aria-label="delete" onClick={handleOpen} size="small">
                <AddCircleOutlineIcon fontSize="small" css={css`
                color:#1976d2;
                ` } />
            </IconButton>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TagSelector
                        setOpen={setOpen}
                        currentHtmlsaveToreducer={currentHtmlsaveToreducer}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default TagContent;
