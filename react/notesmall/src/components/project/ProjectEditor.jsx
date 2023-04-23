/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentCard from "../common/Card"
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { css } from "@emotion/react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProjectList from "./ProjectList";

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
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const ProjectEditor = () => {
    const dispatch = useDispatch();
    const { projectlist } = useSelector((state) => state.project);
    const [projectName, setProjectName] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const getProjectList = () => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response: "_id name  documents {_id title content isDeleted}",
            },
        });
    };
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

    useEffect(() => {
        // console.log("projectList",projectlist)
        // getProjectList()
    }, [projectlist]);

    return (
        <div>
            <Button onClick={handleOpen}>Create project</Button>
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
                            `}
                        >
                            Add project
                        </Button>
                    </div>
                </Box>
            </Modal>

            <ProjectList list={projectlist} />
        </div>
    );
};

export default ProjectEditor;
