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
import Switch from "@mui/material/Switch";
import TagImage from "../../image/Scrum board-bro.svg";
import { Row, Col } from "react-bootstrap";
import extractImageURL from "../../utils/extractImageURL";
import sanitizeContent from "../../utils/sanitizeContent";
import DocumentCard from "../common/Card";
import TagEditor from "./TagEditor";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import getTextColorFromBackground from "../../utils/getTextColorFromBackground";
import ItemCard from "./ItemCard";
import { lift } from "remirror";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    borderRadius: "30px",
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const Taglist = () => {
    const { taglist } = useSelector((state) => state.tag);

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [isActive, setIsActive] = useState(false);

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

    useEffect(() => {
        console.log("taglist", taglist);
    }, [taglist]);

    const getTagList = () => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response:
                    "_id name colorCode  document{_id title content isDeleted}",
            },
        });
    };

    useEffect(() => {
        console.log("useEffect");
        getTagList();
    }, []);

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
                        <TurnedInNotIcon />
                        &ensp;Tags
                    </h5>
                    <div
                        css={css`
                            font-size: 12px;
                            color: #8f9a97;
                        `}
                    >
                        Select a tag to view its documents
                    </div>

                    <div
                        css={css`
                            display: flex;
                            align-items: center;
                        `}
                    >
                        <div>
                            {taglist?.map((item) => (
                                <Chip
                                    key={item._id}
                                    label={item.name}
                                    css={css`
                                        background-color: ${item.colorCode};
                                        margin-right: 5px;
                                        color: ${getTextColorFromBackground(
                                            item.colorCode.slice(1)
                                        )};
                                        :hover {
                                            background-color: ${
                                                item.colorCode
                                            } !important;
                                            opacity: 0.8 !important;
                                            box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2) !important;

                                            color: ${getTextColorFromBackground(
                                                item.colorCode.slice(1)
                                            )} !important;
                                        }

                                    `}
                                    className={
                                        isActive == item._id
                                            ? "tagIsActive"
                                            : "tag"
                                    }
                                    variant="outlined"
                                    onClick={() => {
                                        setIsActive(item._id);

                                        handleButtonClick(item);
                                    }}
                                    deleteIcon={
                                        <EditOutlinedIcon fontSize="small" />
                                    }
                                    onDelete={() => {
                                        console.log(item._id);
                                        handleOpen(
                                            item._id,
                                            item.name,
                                            item.colorCode
                                        );
                                    }}
                                />
                            ))}
                        </div>
                        <TagEditor />
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
                                font-weight: bold;
                                border-radius: 30px;
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
                                font-weight: bold;
                                border-radius: 30px;
                            `}
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
                                    color: #6c757d;
                                    font-size: 1rem;
                                `}
                            >
                                {/* <i className="fa-regular fa-square-check"></i> */}
                                <i className="fa-solid fa-list"></i>
                                &ensp;List
                            </div>
                            <div
                                css={css`
                                    display: flex;
                                    align-items: center;
                                    color: #6c757d;
                                    font-size: 14px;
                                `}
                            >
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
                                selectedButton?.document
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
                                                content={sanitizeContent(
                                                    doc?.content
                                                )}
                                                _id={doc?._id}
                                                image={extractImageURL(
                                                    doc?.content
                                                )}
                                            />
                                        </div>
                                    ))}
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
                                    {selectedButton?.document?.filter(
                                        (doc) => doc.isDeleted
                                    ).length === 0 ? (
                                        <div className="fst-italic mx-3 mb-4">
                                            -None-
                                        </div>
                                    ) : (
                                        selectedButton &&
                                        selectedButton?.document
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
                                                        content={sanitizeContent(
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
                        Quickly Find the Documents You Need with the Power of Tags.
                    </div>
                    <img
                        css={css`
                            width: 410px;
                        `}
                        src={TagImage}
                        alt="TagImage"
                    />
                </div>
            )}
        </div>
    );
};

export default Taglist;
