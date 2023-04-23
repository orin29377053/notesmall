/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
const ProjectSelector = ({ currentHtmlsaveToreducer }) => {
    const dispatch = useDispatch();
    const { editingDocument } = useSelector((state) => state.editor);
    const { projectlist } = useSelector((state) => state.project);
    const { path } = useSelector((state) => state.common);
    const [project, setProject] = useState("");

    const handleChange = (event) => {
        currentHtmlsaveToreducer();
        dispatch({
            type: "UPDATE_PROJECT",
            payload: {
                gqlMethod: "mutation",
                api: "updatedDocument",
                format: `(document:{_id:"${editingDocument._id}" ,project: "${event.target.value}"})`,
                response:
                    "_id title content tags{_id,name,colorCode} project{_id,name} ",
            },
        });
        setProject(event.target.value);
    };
    useEffect(() => {
        if (editingDocument.project) {
            setProject(editingDocument?.project?._id || "");
        } else {
            setProject("none");
        }
    }, [editingDocument, path]);

    useEffect(() => {
        if (editingDocument.project) {
            setProject(editingDocument?.project?._id || "");
        } else {
            setProject("none");
        }
    }, []);

    return (
        <div
            css={css`
                display: flex;
                align-items: center;
            `}
        >
            <AccountTreeOutlinedIcon />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={project||""}
                    onChange={handleChange}
                    label="project"
                >
                    {projectlist.length > 0 && Object.keys(projectlist).map((key) => {
                        return (
                            <MenuItem value={projectlist[key]._id} key={key }>
                                {projectlist[key].name}
                            </MenuItem>
                        );
                    })}
                    <MenuItem value="none">None</MenuItem>

                </Select>
            </FormControl>
        </div>
    );
};

export default ProjectSelector;
