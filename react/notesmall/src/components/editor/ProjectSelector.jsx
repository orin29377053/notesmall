/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector,useDispatch } from "react-redux";
const ProjectSelector = ({currentHtmlsaveToreducer }) => {
    const dispatch = useDispatch();
    const { editingDocument } = useSelector((state) => state.editor);
    const { projectlist } = useSelector((state) => state.project);
    const [project, setProject] = useState(
        editingDocument?.project?._id || ""
    );

    const handleChange = (event) => {
        currentHtmlsaveToreducer()
        dispatch({
            type: "UPDATE_PROJECT",
            payload: {
                gqlMethod: "mutation",
                api: "updatedDocument",
                format: `(document:{_id:"${editingDocument._id}" ,project: "${event.target.value}"})`,
                response: "_id title content tags{_id,name,colorCode} project{_id,name} ",
            },
        })
        setProject(event.target.value);


    };
    useEffect(() => {
        setProject(editingDocument?.project?._id || "");
    }, [editingDocument]);


    return (
        <div
            css={css`
                display: flex;
                align-items: center;
            `}
        >
            <AccountTreeOutlinedIcon />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                {/* <InputLabel id="demo-simple-select-label">eAge</InputLabel> */}
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={project}
                    onChange={handleChange}
                    label="project"
                >
                    {Object.keys(projectlist).map((key) => {
                        return (
                            <MenuItem value={projectlist[key]._id}>
                                {projectlist[key].name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
};

export default ProjectSelector;
