/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import markdownHandler from "../../utils/markdownHandler";
import { css } from "@emotion/react";
import { IconButton, Chip, Modal, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Switch from "@mui/material/Switch";
import { Row, Col } from "react-bootstrap";
import ProjectEditor from "./ProjectEditor";
import ProjectImage from "../../image/Accept tasks-bro.svg";
import AddDocument from "./AddDocument";
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

const ProjectList = ({ list }) => {
    const dispatch = useDispatch();
    const { projectlist } = useSelector((state) => state.project);
    const [projectName, setProjectName] = useState("");
    const [id, setId] = useState("");
    const [selectedButton, setSelectedButton] = useState(null);
    const [open, setOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [isActive, setIsActive] = useState(false);

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
                response: "_id name  documents {_id title content isDeleted}",
            },
        });
    };

    useEffect(() => {}, [selectedButton]);

    useEffect(() => {
        if (projectlist?.length > 0 && selectedButton == null) {
            let i = 0;
            while (i < projectlist.length) {
                if (projectlist[i].length > 0) {
                    setSelectedButton(projectlist[i]);
                    setIsActive(projectlist[i]._id);
                    break;
                }
                i++;
            }
            if (i == projectlist.length) {
                setSelectedButton(projectlist[0]);
                setIsActive(projectlist[0]._id);
            }
        }
    }, [projectlist]);

    return (
        <div>
            <Row
                className="m-0"
                css={css`
                    align-items: center;
                    padding: 10px;
                `}
            >
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                    `}
                >
                    <h5
                        css={css`
                            margin-top: 5px;
                        `}
                    >
                        <i className="fa-regular fa-folder-open"></i>
                        &ensp;Project Manager
                    </h5>
                    <div
                        css={css`
                            font-size: 12px;
                            color: #8f9a97;
                        `}
                    >
                        Select a project to view its documents
                    </div>

                    <div
                        css={css`
                            display: flex;
                            align-items: center;
                        `}
                    >
                        {projectlist.length > 0 ? (
                            <>
                                <div>
                                    {projectlist?.map((item) => (
                                        <Chip
                                            key={item._id}
                                            label={item.name}
                                            className={
                                                isActive == item._id
                                                    ? "projectIsActive"
                                                    : "project"
                                            }
                                            size="large"
                                            css={css`
                                                margin-right: 5px;
                                            `}
                                            variant="outlined"
                                            onClick={() => {
                                                setIsActive(item._id);
                                                handleButtonClick(item);
                                            }}
                                            deleteIcon={<EditOutlinedIcon />}
                                            onDelete={() => {
                                                handleOpen(item._id, item.name);
                                            }}
                                        />
                                    ))}
                                </div>
                                <ProjectEditor />
                            </>
                        ) : (
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                `}
                            >
                                Create a project first{" "}
                                <ProjectEditor first={false} />
                            </div>
                        )}
                    </div>
                </div>
            </Row>

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
                                font-weight: bold;
                                border-radius: 30px;
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
                                if (id == selectedButton?._id) {
                                    setSelectedButton(null);
                                }
                            }}
                            css={css`
                                margin-top: 10px;
                                float: left;
                                font-weight: bold;
                                border-radius: 30px;
                            `}
                            color="error"
                        >
                            DELETE
                        </Button>
                    </div>
                </Box>
            </Modal>
            <hr
                css={css`
                    margin: 0 15px;
                `}
            />
            {selectedButton ? (
                <div
                    css={css`
                        padding: 10px;
                    `}
                >
                    <Row className="m-0">
                        <div
                            css={css`
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding-right: 0px;
                            `}
                        >
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                `}
                            >
                                <div
                                    css={css`
                                        font-size: 14px;
                                    `}
                                >
                                    <AddDocument
                                        first={false}
                                        selectedButton={selectedButton}
                                        setSelectedButton={setSelectedButton}
                                    />
                                </div>
                            </div>

                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    color: #6c757d;
                                    font-size: 14px;
                                `}
                            >
                                {" "}
                                Show deleted
                                <Switch
                                    onChange={(e) => {
                                        setShowDelete(e.target.checked);
                                    }}
                                />
                            </div>
                        </div>
                    </Row>

                    <Row
                        className="m-0"
                        css={css`
                            max-width: fit-content;
                            overflow: auto;
                        `}
                    >
                        <Col className="d-inline-flex mt-2">
                            {selectedButton &&
                            selectedButton?.documents.filter(
                                (doc) => !doc.isDeleted
                            ).length === 0 ? (
                                <div
                                    css={css`
                                        display: flex;
                                        justify-content: space-around;
                                        align-items: center;
                                        flex-direction: row;
                                    `}
                                >
                                    <div
                                        css={css`
                                            color: #6c757d;
                                            font-size: 1rem;
                                            margin-right: 10px;
                                            font-style: italic;
                                        `}
                                    >
                                        This project is empty, Please add some
                                        documents
                                    </div>
                                    {/* <AddDocument
                                        first={true}
                                        selectedButton={selectedButton}
                                        setSelectedButton={setSelectedButton}
                                    /> */}
                                </div>
                            ) : (
                                <>
                                    {selectedButton &&
                                        selectedButton?.documents
                                            ?.filter((doc) => !doc.isDeleted)
                                            .map((doc) => (
                                                <div
                                                    key={doc?._id}
                                                    className="mb-2 d-block me-3"
                                                    css={css`
                                                        min-width: 300px !important;
                                                        width: 300px !important;
                                                    `}
                                                >
                                                    <DocumentCard
                                                        title={doc?.title}
                                                        content={markdownHandler(
                                                            doc?.content
                                                        )}
                                                        _id={doc?._id}
                                                        image={extractImageURL(
                                                            doc?.content
                                                        )}
                                                    />
                                                </div>
                                            ))}
                                </>
                            )}
                        </Col>
                    </Row>
                    {showDelete && (
                        <>
                            <hr
                                css={css`
                                    margin: 15px;
                                `}
                            />

                            <Row
                                className="m-0"
                                css={css`
                                    max-width: fit-content;
                                    overflow: auto;
                                    margin-top: 10px !important;
                                `}
                            >
                                <div
                                    css={css`
                                        color: #6c757d;
                                        font-size: 1rem;
                                    `}
                                >
                                    <i className="fa-regular fa-trash-can"></i>
                                    &ensp;Deleted
                                </div>
                                <Col className="d-inline-flex mt-2">
                                    {selectedButton?.documents?.filter(
                                        (doc) => doc.isDeleted
                                    ).length === 0 ? (
                                        <div className="fst-italic mx-3 mb-4">
                                            -None-
                                        </div>
                                    ) : (
                                        selectedButton &&
                                        selectedButton?.documents
                                            ?.filter((doc) => doc.isDeleted)
                                            .map((doc) => (
                                                <div
                                                    key={doc?._id}
                                                    className="mb-2 d-block me-3"
                                                    css={css`
                                                        min-width: 300px !important;
                                                        width: 300px !important;
                                                    `}
                                                >
                                                    <DocumentCard
                                                        title={doc?.title}
                                                        content={markdownHandler(
                                                            doc?.content
                                                        )}
                                                        _id={doc?._id}
                                                        image={extractImageURL(
                                                            doc?.content
                                                        )}
                                                    />
                                                </div>
                                            ))
                                    )}
                                </Col>
                            </Row>
                        </>
                    )}
                </div>
            ) : (
                <div
                    css={css`
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        flex-direction: row;
                    `}
                >
                    <div
                        css={css`
                            color: #6c757d;
                            width: 300px;
                            font-size: 1.5rem;
                        `}
                    >
                        Easily Organize Your Documents Through Project
                        Management.
                        <ProjectEditor first={true} />
                    </div>
                    <img
                        css={css`
                            width: 410px;
                        `}
                        src={ProjectImage}
                        alt="ProjectImage"
                    />
                </div>
            )}
        </div>
    );
};

export default ProjectList;
