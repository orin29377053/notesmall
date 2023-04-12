import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommonProvider = ({ children }) => {
    const { selectedID } = useSelector((state) => state.common);
    const dispatch = useDispatch();
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
    const getProjectList = () => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response: "_id name  documents {_id title content}",
            },
        });
    };
    useEffect(() => {
        getTagList();
        getProjectList();
    }, []);

    let history = useNavigate();
    useEffect(() => {
        history(`/${selectedID}`);
    }, [selectedID]);



    return <div>{children}</div>;
};

export default CommonProvider;
