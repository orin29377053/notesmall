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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";

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

const AddDocument = ({ first, selectedButton, setSelectedButton }) => {
    const dispatch = useDispatch();
    const [projectName, setProjectName] = useState("");
    const [selectDocument, setSelectDocument] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { sidebar } = useSelector((state) => state.common);
    const { projectlist } = useSelector((state) => state.project);

    const filterdoc = projectlist.flatMap((item) => {
        return item?.documents?.map((doc) => doc._id);
    });
    const filteredSidebar =
        sidebar && sidebar.length
            ? sidebar.filter(
                  (item) => !item.isDeleted && !filterdoc.includes(item._id)
              )
            : [];

    const flatProps = {
        options: filteredSidebar?.map((option) => ({
            id: option._id,
            title: option.title,
        })),
    };

    return (
        <div>
            {first ? (
                <Button
                    css={css`
                        margin-top: 10px;
                        float: right;
                        font-weight: bold;
                        border-radius: 10px;
                    `}
                    variant="contained"
                    onClick={handleOpen}
                >
                    Add Document!
                </Button>
            ) : (
                <div
                    css={css`
                        color: white;
                        cursor: pointer;
                        border-radius: 10px;
                        padding: 4px 10px;
                        color: #1976d2;
                        // background-color: #1976d2;
                        border: 1px solid #1976d2;
                        font-weight: bold;
                        :hover {

                            box-shadow: 
                            2px 1px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)
                        }
                        
                    `}
                    onClick={handleOpen}
                        
                    >
                        
                    <i className="fa-solid fa-file-import fx-xl"></i> &ensp;ADD DOCUMENT
                </div>
            )}

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
                            margin-bottom: 10px;
                        `}
                    >
                        Add Document to your project
                    </div>
                    <div css={css`
                            font-size: 15px;
                            color: #8f9a97;
                            margin-bottom: 10px;
                        `}>
                        You can only add document which is not added to any other project
                    </div>

                    <Autocomplete
                        {...flatProps}
                        id="flat-demo"
                        getOptionSelected={(option, value) =>
                            option.id === value.id
                        }
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Document"
                                variant="standard"
                            />
                        )}
                        onChange={(event, value) => {
                            const selectedItem = value
                                ? filteredSidebar.find(
                                      (option) => option._id === value.id
                                  )
                                : null;

                            setSelectDocument(selectedItem);
                        }}
                    />

                    <div>
                        <Button
                            variant="contained"
                            // disabled={selectDocument === null}
                            onClick={() => {
                                dispatch({
                                    type: "UPDATE_PROJECT",
                                    payload: {
                                        gqlMethod: "mutation",
                                        api: "updatedDocument",
                                        format: `(document:{_id:"${selectDocument._id}" ,project: "${selectedButton._id}"})`,
                                        response:
                                            "_id title content tags{_id,name,colorCode} project{_id,name} ",
                                    },
                                });
                                const newSelectProject = {
                                    ...selectedButton,
                                    documents: [
                                        ...selectedButton.documents,
                                        selectDocument,
                                    ],
                                };
                                setSelectedButton(newSelectProject);

                                
                                handleClose();
                            }}
                            css={css`
                                margin-top: 20px;
                                float: right;
                                font-weight: bold;
                                border-radius: 30px;
                            `}
                        >
                            Add to project
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* <ProjectList list={projectlist} /> */}
        </div>
    );
};

export default AddDocument;
