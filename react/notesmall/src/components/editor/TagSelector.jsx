/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";

import { useSelector, useDispatch } from "react-redux";
import Chip from "@mui/material/Chip";
import { Button } from "@mui/material";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TagEditor from "../tag/TagEditor";
import { memo } from "react";

const selectTag = (tag, select, setSelect, unselect, setUnselect, dispatch) => {
    setSelect([...select, tag]);
    setUnselect(unselect.filter((item) => item._id !== tag._id));
};

const unselectTag = (tag, select, setSelect, unselect, setUnselect) => {
    setUnselect([...unselect, tag]);
    setSelect(select.filter((item) => item._id !== tag._id));
};


const UnSelectTagList = ({
    select,
    setSelect,
    unselect,
    setUnselect,
    getTextColorFromBackground,
}) => {
    return unselect?.map((item) => (
        <>
            <Chip
                key={item._id}
                label={item.name}
                css={css`
                    background-color: ${item.colorCode};
                    margin: 5px;
                    color: ${getTextColorFromBackground(
                        item.colorCode.slice(1)
                    )};
                    font-size: 12px;
                    font-weight: bold;
                    :hover {
                        background-color: ${item.colorCode} !important;
                        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
                            0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
                    }
                `}
                variant="outlined"
                onClick={() => {
                    selectTag(item, select, setSelect, unselect, setUnselect);
                    // handleOpen(item._id, item.name, item.colorCode);
                }}
            />
        </>
    ));
};

const SelectTagList = ({
    select,
    setSelect,
    unselect,
    setUnselect,
    getTextColorFromBackground,
}) => {
    return select?.map((item) => (
        <>
            <Chip
                key={item._id}
                label={item.name}
                css={css`
                    background-color: ${item.colorCode};
                    margin: 5px;
                    color: ${getTextColorFromBackground(
                        item.colorCode.slice(1)
                    )};
                    font-size: 12px;
                    font-weight: bold;
                `}
                variant="outlined"
                onDelete={() =>
                    unselectTag(item, select, setSelect, unselect, setUnselect)
                }
            />
        </>
    ));
};
const TagSelector = ({ setOpen, currentHtmlsaveToreducer }) => {
    const dispatch = useDispatch();

    const { taglist } = useSelector((state) => state.tag);
    const [select, setSelect] = useState([]);
    const [unselect, setUnselect] = useState([]);
    const { editingDocument } = useSelector((state) => state.editor);
    const documentTags = editingDocument?.tags;
    useEffect(() => {
        

        const filteredTags = taglist.filter(
            (tag) => !documentTags.some((docTag) => docTag._id === tag._id)
        );

        setSelect(documentTags);
        setUnselect(filteredTags);
    }, [taglist, documentTags]);

    const handleSave = () => {
        currentHtmlsaveToreducer();
        const tags = Object.values(select).map((item) => `"${item._id}"`);

        dispatch({
            type: "UPDATE_TAGS",
            payload: {
                gqlMethod: "mutation",
                api: "updatedDocument",
                format: `(document:{_id:"${editingDocument._id}" ,tags: [${tags}]})`,
                response: "_id title content tags{_id,name,colorCode} ",
            },
        });
        setOpen(false);
    };
    function getTextColorFromBackground(bgColor) {
        let rgbColor = hexToRgb(bgColor);
        let gray =
            0.2126 * rgbColor.r + 0.7152 * rgbColor.g + 0.0722 * rgbColor.b;
        let threshold = 128;
        return gray < threshold ? "#ffffff" : "#000000";
    }

    function hexToRgb(hexColor) {
        let r = parseInt(hexColor.substr(0, 2), 16);
        let g = parseInt(hexColor.substr(2, 2), 16);
        let b = parseInt(hexColor.substr(4, 2), 16);

        return { r: r, g: g, b: b };
    }


    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
            `}
        >
            <h3
                css={css`
                    align-self: center;
                    align-items: center;
                    display: flex;
                `}
            >
                <TurnedInNotIcon
                    fontSize="middle"
                    css={css`
                        margin-right: 5px;
                        color: #1976d2;
                    `}
                />
                Tags Selector
            </h3>

            <div
                css={css`
                    border-radius: 5px;
                    padding: 10px;
                    margin-top: 20px;
                `}
            >
                <div
                    css={css`
                        font-size: 12px;
                        color: #8f9a97;
                        padding-left: 5px;
                    `}
                >
                    Click to select
                </div>
                <div
                    css={css`
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                    `}
                >
                    {taglist.length > 0 ? (
                        <UnSelectTagList
                            unselect={unselect}
                            select={select}
                            setSelect={setSelect}
                            setUnselect={setUnselect}
                            getTextColorFromBackground={
                                getTextColorFromBackground
                            }
                        />
                    ) : (
                        "Create your first tag "
                    )}
                    <TagEditor />
                </div>
            </div>
            <div
                css={css`
                    display: flex;
                    margin-top: 10px;
                    padding-left: 16px;
                    color: #8f9a97;
                `}
            >
                <i className="fa-solid fa-arrow-right-arrow-left fa-rotate-90"></i>
            </div>
            <div
                css={css`
                    border-radius: 5px;
                    padding: 10px;
                    margin-top: 20px;
                `}
            >
                <div
                    css={css`
                        font-size: 12px;
                        color: #8f9a97;
                        padding-left: 5px;
                    `}
                >
                    Click X to cancel
                </div>
                <SelectTagList
                    unselect={unselect}
                    select={select}
                    setSelect={setSelect}
                    setUnselect={setUnselect}
                    getTextColorFromBackground={getTextColorFromBackground}
                />
            </div>

            <Button
                variant="contained"
                onClick={() => handleSave()}
                css={css`
                    background-color: #1976d2;
                    border-radius: 30px;
                    margin-top: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 5px 20px;
                    &:hover {
                        background-color: #1976d2 !important;
                    }
                `}
            >
                Save
            </Button>
        </div>
    );
};

export default TagSelector;
