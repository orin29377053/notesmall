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

const UnSelectTagList = ({ select, setSelect, unselect, setUnselect }) => {
    return unselect?.map((item) => (
        <>
            <Chip
                key={item._id}
                label={item.name}
                css={css`
                    background-color: ${item.colorCode};
                    margin: 5px;
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

const SelectTagList = ({ select, setSelect, unselect, setUnselect }) => {
    return select?.map((item) => (
        <>
            <Chip
                key={item._id}
                label={item.name}
                css={css`
                    background-color: ${item.colorCode};
                    margin: 5px;
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
