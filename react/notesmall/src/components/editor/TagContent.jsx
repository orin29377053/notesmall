/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TagSelector from "./TagSelector";

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
        <div
            css={css`
                border-radius: 5px;
                font-size: 14px;
                cursor: pointer;
                

                &:hover {
                    background-color: #ecf1fe;
                    color: #1976d2;
                    font-weight: 700;
                }
            `}
        >
            {/* <Badge
                badgeContent={tagLength}
                color="secondary"
                css={css`
                    margin-left: 10px;
                    margin-right: 10px;
                `}
                onClick={handleOpen}
            >
                <TurnedInNotIcon color="action" />
            </Badge> */}
            <div onClick={handleOpen} css={css`
            display: flex;
            align-items: center;

            
            `}>
                <TurnedInNotIcon
                    css={css`
                        color: #1976d2;
                        margin-right: 5px;

                    `}
                />
                <div>Tags</div>
            </div>
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
        </div>
    );
};

export default TagContent;
