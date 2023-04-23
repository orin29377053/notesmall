/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MuiColorInput } from "mui-color-input";
import Chip from "@mui/material/Chip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import getTextColorFromBackground from "../../utils/getTextColorFromBackground";
import ItemCard from "./ItemCard";

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

const Taglist = ({ taglist }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);

    const handleOpen = (id, name, colorCode) => {
        setId(id);
        setTagname(name);
        setColor(colorCode);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [color, setColor] = useState("");
    const [tagname, setTagname] = useState("");
    const [id, setId] = useState("");
    const handleChange = (color) => {
        setColor(color);
    };
    const updateTag = (id) => {
        dispatch({
            type: "FETCH_UPDATE_TAG",
            payload: {
                gqlMethod: "mutation",
                api: "updatedTag",
                format: `(tag:{_id:"${id}" ,name: "${tagname}", colorCode: "${color}"})`,
                response: "_id name colorCode document{_id title content}",
            },
        });
    };

    const deleteTag = (id) => {
        dispatch({
            type: "FETCH_DELETE_TAG",
            payload: {
                gqlMethod: "mutation",
                api: "deleteTag",
                format: `(id:"${id}")`,
                response: "_id",
            },
        });
    };

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <div>
            {taglist?.map((item) => (
                <Chip
                    key={item._id}
                    label={item.name}
                    css={css`
                        background-color: ${item.colorCode};
                        margin: 5px;
                        color: ${getTextColorFromBackground(
                            item.colorCode.slice(1)
                        )};
                    `}
                    variant="outlined"
                    onClick={() => {
                        // console.log(item.name);
                        handleButtonClick(item);
                    }}
                    deleteIcon={<AutoAwesomeIcon />}
                    onDelete={() => {
                        console.log(item._id);
                        handleOpen(item._id, item.name, item.colorCode);
                    }}
                />
            ))}
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
                        Tag Editor
                    </div>
                    <TextField
                        fullWidth
                        required
                        id="standard-basic"
                        label="Tag name"
                        variant="outlined"
                        margin="normal"
                        value={tagname}
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
                                updateTag(id);
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
                            disabled={tagname === ""}
                            onClick={() => {
                                deleteTag(id);
                                handleClose();
                            }}
                            color="error"

                            css={css`
                                margin-top: 10px;
                                float: left;
                            `}
                        >
                            DELETE
                        </Button>
                    </div>
                </Box>
            </Modal>
            
            <div
                css={css`
                    display: flex;
                    flex-wrap: wrap;
                `}
            >
                <ItemCard
                    
                    item={selectedButton}
                />
            </div>
        </div>
    );
};

export default Taglist