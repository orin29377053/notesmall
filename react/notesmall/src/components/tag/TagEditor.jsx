/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MuiColorInput } from "mui-color-input";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Taglist from "./Taglist";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "30px",

    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};


const TagEditor = () => {
    const dispatch = useDispatch();
    const { taglist } = useSelector((state) => state.tag);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [color, setColor] = useState("#ffffff");
    const [tagname, setTagname] = useState("");
    const handleChange = (color) => {
        setColor(color);
    };

    const addTag = () => {
        dispatch({
            type: "FETCH_ADD_TAG",
            payload: {
                gqlMethod: "mutation",
                api: "createTag",
                format: `(tag:{name: "${tagname}", colorCode: "${color}"})`,
                response: "_id name colorCode",
            },
        });
    };
    const getTagList = () => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode  document{_id title content isDeleted}",
            },
        });
    };

    useEffect(() => {
        console.log("useEffect");
        getTagList();
    }, []);

    return (
        <div>
            <IconButton
                aria-label="delete"
                color="primary"
                onClick={handleOpen}
            >
                <AddCircleIcon fontSize="large" />
            </IconButton>
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
                        Create New tag
                    </div>
                    <TextField
                        fullWidth
                        required
                        id="standard-basic"
                        label="Tag name"
                        variant="outlined"
                        margin="normal"
                        onChange={(e) => {
                            setTagname(e.target.value);
                        }}
                    />
                    <div
                        css={css`
                            margin-top: 10px;
                            margin-bottom: 10px;
                            font-size: 15px;
                            font-weight: bold;
                        `}
                    >
                        Choose your tag color
                    </div>
                    <MuiColorInput
                        fullWidth
                        value={color}
                        onChange={handleChange}
                        format="hex"
                        css={css`
                            margin-top: 10px;
                            margin-bottom: 10px;
                        `}
                    />
                    <div>
                        <Button
                            variant="contained"
                            disabled={tagname === ""}
                            onClick={() => {
                                addTag();
                                handleClose();
                            }}
                            css={css`
                                margin-top: 10px;
                                float: right;
                                font-weight: bold;
                                border-radius: 30px;
                            `}
                        >
                            Add tag
                        </Button>
                    </div>
                </Box>
            </Modal>
            

            {/* <div>
                <Taglist
                    css={css`
                        display: flex;
                    `}
                    taglist={taglist}
                />
            </div> */}
        </div>
    );
};

export default TagEditor;
