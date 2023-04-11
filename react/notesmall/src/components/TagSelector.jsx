/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";

import { useSelector, useDispatch } from "react-redux";
import Chip from "@mui/material/Chip";
import { Button } from "@mui/material";

const selectTag = (tag, select, setSelect, unselect, setUnselect, dispatch) => {
    setSelect([...select, tag]);
    setUnselect(unselect.filter((item) => item._id !== tag._id));
    console.log("select!!!!!", select);
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
                `}
                variant="outlined"
                onClick={() => {
                    console.log(item._id);
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
                `}
                variant="outlined"
                onDelete={() =>
                    unselectTag(item, select, setSelect, unselect, setUnselect)
                }
            />
        </>
    ));
};
const TagSelector = ({ setOpen }) => {
    const dispatch = useDispatch();

    const { taglist } = useSelector((state) => state.tag);
    const [select, setSelect] = useState([]);
    const [unselect, setUnselect] = useState([]);
    const { editingDocument } = useSelector((state) => state.editor);
    const documentTags = editingDocument?.tags;
    console.log("editingDocument", editingDocument);
    useEffect(() => {
        const filteredTags = taglist.filter(
            (tag) => !documentTags.some((docTag) => docTag._id === tag._id)
        );
        // console.log(filteredTags, documentTags);
        setSelect(documentTags);
        setUnselect(filteredTags);
    }, [taglist, documentTags]);

    // console.log(taglist, documentTags);

    const handleSave = () => {
        const tags = Object.values(select).map((item) => `"${item._id}"`);

        // console.log("select", tags);
        dispatch({
            type: "UPDATE_TAGS",
            payload: {
                gqlMethod: "mutation",
                api: "updatedDocument",
                format: `(document:{_id:"${editingDocument._id}" ,tags: [${tags}]})`,
                response: "tags{_id,name,colorCode} ",
            },
        });
        setOpen(false);
    };
    function getTextColorFromBackground(bgColor) {
        // 将16进制背景色转换为RGB颜色
        var rgbColor = hexToRgb(bgColor);
        // 将RGB颜色转换为灰度值
        var gray =
            0.2126 * rgbColor.r + 0.7152 * rgbColor.g + 0.0722 * rgbColor.b;

        // 设置灰度值阈值
        var threshold = 128;
        // 如果灰度值小于阈值，则返回白色文本颜色，否则返回黑色文本颜色
        return gray < threshold ? "#ffffff" : "#000000";
    }

    function hexToRgb(hexColor) {
        // 将16进制颜色转换为RGB颜色
        var r = parseInt(hexColor.substr(0, 2), 16);
        var g = parseInt(hexColor.substr(2, 2), 16);
        var b = parseInt(hexColor.substr(4, 2), 16);

        return { r: r, g: g, b: b };
    }

    // console.log(select, unselect);

    return (
        <div>
            <div>
                unselect
                <UnSelectTagList
                    unselect={unselect}
                    select={select}
                    setSelect={setSelect}
                    setUnselect={setUnselect}
                    getTextColorFromBackground={getTextColorFromBackground}
                />
            </div>
            <br></br>
            <div>
                select
                <SelectTagList
                    unselect={unselect}
                    select={select}
                    setSelect={setSelect}
                    setUnselect={setUnselect}
                    getTextColorFromBackground={getTextColorFromBackground}
                />
            </div>
            {console.log(2)}
            <Button
                variant="contained"
                onClick={() => handleSave()}
                css={css`
                    margin-top: 10px;
                    float: right;
                `}
            >
                Save
            </Button>
        </div>
    );
};

export default TagSelector;
