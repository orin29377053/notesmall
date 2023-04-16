import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const CommonProvider = ({ children }) => {
    const { selectedID } = useSelector((state) => state.common);
    const location = useLocation();
    const dispatch = useDispatch();
    const getTagList = () => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode  document{_id title content}",
            },
        });
    };
    const getProjectList = () => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response: "_id name  documents {_id title content updated_at}",
            },
        });
    };
    const getlist = () => {
        dispatch({
            type: "FETCH_SIDEBAR_LIST",
            payload: {
                gqlMethod: "query",
                api: "documents",
                format: "(isDeleted: false)",
                response:
                    "_id title updated_at isDeleted isFavorite isArchived",
            },
        });
    };
    useEffect(() => {
        getTagList();
        getProjectList();
        getlist();
    }, []);

    let history = useNavigate();
    useEffect(() => {
        history(`/${selectedID}`);
    }, [selectedID]);

    useEffect(() => {
        console.log("path is change", location.pathname)
        dispatch({
            type: "UPDATE_PATH",
            payload: { path: location.pathname },
        });
    }, [location]);

    return <div>{children}</div>;
};

export default CommonProvider;
