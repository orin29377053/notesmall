/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector, useDispatch } from "react-redux";
const ProjectSelector = ({ currentHtmlsaveToreducer ,isEditable }) => {
    const dispatch = useDispatch();
    const { editingDocument } = useSelector((state) => state.editor);
    const { projectlist } = useSelector((state) => state.project);
    const { path } = useSelector((state) => state.common);
    const [project, setProject] = useState("");
    const [projectListResult, setProjectListResult] = useState([]);

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

    useEffect(() => {
        if (projectlist.length > 0) {
            setProjectListResult(projectlist);
        }
    }, [projectlist]);

    return (
        <div
            css={css`
                display: flex;
                align-items: center;
                font-size: 14px;
                border-radius: 5px;

                &:hover {
                    background-color: #ecf1fe;
                    color: #1976d2;
                    font-weight: 700;
                }
            `}
        >
           
            <FormControl
                variant="standard"
                sx={{ minWidth: 130}}
            >
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={project || ""}
                    onChange={handleChange}
                    disabled={!isEditable}
                    label="project"
                    css={css`
                        font-size: 13px;
                        border: none;
                        text-decoration: none;
                    `}
                >
                    <MenuItem
                        dense={true}
                        value="none"
                        css={css`
                        font-size: 13px;

                            color: gray;
                            font-style: italic;
                        `}
                        divider={true}
                    >
                        None
                    </MenuItem>
                    {projectListResult.length > 0 &&
                        Object.keys(projectListResult).map((key) => {
                            return (
                                <MenuItem
                                    value={projectListResult[key]._id}
                                    key={key}
                                    css={css`
                                        font-size: 13px;
                                    `}
                                    dense={true}
                                >
                                    {projectListResult[key].name}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </div>
    );
};

export default ProjectSelector;
