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
        console.log(tagname, color);
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
    function getTextColorFromBackground(bgColor) {
        // 将16进制背景色转换为RGB颜色
        let rgbColor = hexToRgb(bgColor);
        // 将RGB颜色转换为灰度值
        let gray =
            0.2126 * rgbColor.r + 0.7152 * rgbColor.g + 0.0722 * rgbColor.b;

        // 设置灰度值阈值
        let threshold = 128;
        // 如果灰度值小于阈值，则返回白色文本颜色，否则返回黑色文本颜色
        return gray < threshold ? "#ffffff" : "#000000";
    }

    function hexToRgb(hexColor) {
        // 将16进制颜色转换为RGB颜色
        let r = parseInt(hexColor.substr(0, 2), 16);
        let g = parseInt(hexColor.substr(2, 2), 16);
        let b = parseInt(hexColor.substr(4, 2), 16);

        return { r: r, g: g, b: b };
    }

    return (
        <div>
            {taglist?.map((item) => (
                <Chip
                    // icon={<TurnedInNotIcon />}
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
        </div>
    );
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

    const getTagList = () => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode document{_id title content}",
            },
        });
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

    useEffect(() => {
        getTagList();
    }, []);

    return (
        <div>
            <Button onClick={handleOpen}>Create tag</Button>
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
                            `}
                        >
                            Add tag
                        </Button>
                    </div>
                </Box>
            </Modal>
            <div>
                <Taglist taglist={taglist} />
            </div>
            {/* <TagSelector /> */}
        </div>
    );
};

export default TagEditor;
