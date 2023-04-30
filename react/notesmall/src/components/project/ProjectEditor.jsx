/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { css } from "@emotion/react";
import { Modal, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProjectList from "./ProjectList";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ItemCard = ({ item }) => {
    return item?.documents?.map((doc) => (
        <DocumentCard
            title={doc.title}
            content={sanitizeContent(doc.content)}
            _id={doc._id}
            image={extractImageURL(doc.content)}
        />
    ));
};
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    "border-radius": "20px",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const ProjectEditor = () => {
    const dispatch = useDispatch();
    const [projectName, setProjectName] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const addProject = () => {
        dispatch({
            type: "FETCH_CREATE_PROJECT",
            payload: {
                gqlMethod: "mutation",
                api: "createProject",
                format: `(project:{name:"${projectName}"})`,
                response: "_id name  documents {_id title content isDeleted}",
            },
        });
    };

    return (
        <div>
            <IconButton
                aria-label="delete"
                color="primary"
                onClick={handleOpen}
            >
                <AddCircleIcon fontSize="large" />
            </IconButton>
            {/* <IconButton onClick={handleOpen}>Create project</IconButton> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div
                        css={css`
                            font-size: 20px;
                            font-weight: bold;
                        `}
                    >
                        Create New project
                    </div>
                    <TextField
                        fullWidth
                        required
                        id="standard-basic"
                        label="Project name"
                        variant="outlined"
                        margin="normal"
                        onChange={(e) => {
                            setProjectName(e.target.value);
                        }}
                    />

                    <div>
                        <Button
                            variant="contained"
                            disabled={projectName === ""}
                            onClick={() => {
                                addProject();
                                handleClose();
                            }}
                            css={css`
                                margin-top: 10px;
                                float: right;
                                font-weight: bold;
                                border-radius: 30px;
                            `}
                        >
                            Add project
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* <ProjectList list={projectlist} /> */}
        </div>
    );
};

export default ProjectEditor;
