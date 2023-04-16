import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentCard from "../Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { css } from "@emotion/react";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

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

const ProjectList = ({ list }) => {
    const dispatch = useDispatch();
    const { projectlist } = useSelector((state) => state.project);
    const [projectName, setProjectName] = useState("");
    const [id, setId] = useState("");
    const [selectedButton, setSelectedButton] = useState(null);
    const [open, setOpen] = useState(false);
    const getProjectList = () => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response: "_id name  documents {_id title content}",
            },
        });
    };
    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = (id, name) => {
        setId(id);
        setProjectName(name);
        setOpen(true);
    };

    const deleteProject = (id) => {
        dispatch({
            type: "FETCH_DELETE_PROJECT",
            payload: {
                gqlMethod: "mutation",
                api: "deleteProject",
                format: `(id:"${id}")`,
                response: "_id",
            },
        });
    };
    const updateProject = (id) => {
        dispatch({
            type: "FETCH_UPDATE_PROJECT",
            payload: {
                gqlMethod: "mutation",
                api: "updateProject",
                format: `(project:{_id:"${id}", name:"${projectName}"})`,
                response: "_id name  documents {_id title content}",
            },
        });
    };

    return (
        <div>
            <div>
                {projectlist?.map((item) => (
                    <Chip
                        key={item._id}
                        label={item.name}
                        css={css`
                            margin: 5px;
                        `}
                        variant="outlined"
                        onClick={() => {
                            // console.log(item.name);
                            handleButtonClick(item);
                        }}
                        deleteIcon={<EditOutlinedIcon />}
                        onDelete={() => {
                            console.log(item._id);
                            handleOpen(item._id, item.name);
                        }}
                    />
                ))}
            </div>
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
                        Project Editor
                    </div>
                    <TextField
                        fullWidth
                        required
                        id="standard-basic"
                        label="Project name"
                        variant="outlined"
                        margin="normal"
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value);
                        }}
                    />

                    <div>
                        <Button
                            variant="contained"
                            disabled={projectName === ""}
                            onClick={() => {
                                updateProject(id);
                                handleClose();
                            }}
                            css={css`
                                margin-top: 10px;
                                float: right;
                            `}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            disabled={projectName === ""}
                            onClick={() => {
                                deleteProject(id);
                                handleClose();
                            }}
                            css={css`
                                margin-top: 10px;
                                float: left;
                            `}
                            color="error"
                        >
                            DELETE
                        </Button>
                    </div>
                </Box>
            </Modal>
            <ItemCard
                css={css`
                    width: 100%;
                    margin-left: 20px;
                `}
                item={selectedButton}
            />
        </div>
    );
};

export default ProjectList;
