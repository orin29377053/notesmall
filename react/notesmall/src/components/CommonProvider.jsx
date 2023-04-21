import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const CommonProvider = ({ children }) => {
    // const { selectedID } = useSelector((state) => state.common);
    const { user ,token} = useSelector((state) => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useNavigate();
    const getTagList = (dispatch) => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode  document{_id title content}",
            },
        });
    };
    const getProjectList = (dispatch) => {
        dispatch({
            type: "FETCH_Project_LIST",
            payload: {
                gqlMethod: "query",
                api: "projects",
                response:
                    "_id name  documents {_id title content updated_at isDeleted}",
            },
        });
    };
    const getlist = (dispatch) => {
        dispatch({
            type: "FETCH_SIDEBAR_LIST",
            payload: {
                gqlMethod: "query",
                api: "documents",
                response:
                    "_id title updated_at isDeleted isFavorite isArchived",
            },
        });
    };
    const getUser = (dispatch) => {
        dispatch({
            type: "FETCH_USER_INFO",
            payload: {
                gqlMethod: "query",
                api: "me",
                response: `_id 
                    email 
                    token 
                    role
                    documents{
                        _id title updated_at isDeleted isFavorite isArchived
                    }
                    projects{
                        _id name  documents {
                            _id title content updated_at isDeleted
                        }
                    }`,
            },
        });
    };
    if (!user) {
        getUser(dispatch);
    }

    useEffect(() => {
        getTagList(dispatch);
        getProjectList(dispatch);
        getlist(dispatch);
        getUser(dispatch);
    }, []);

    useEffect(() => {
        console.log("user", user);

        getTagList(dispatch);
        getProjectList(dispatch);
        getlist(dispatch);
        // getUser()
    }, [user]);

    // if localstorge toke is chaged, update the user info

    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if (!localToken && token) {
            console.log(token);
            dispatch({ type: "LOGOUT" });
            //reload
            history("/home");
            // window.location.reload();
        }
        dispatch({
            type: "UPDATE_PATH",
            payload: { path: location.pathname },
        });
    }, [location]);

    return <div>{children}</div>;
};

export default CommonProvider;
