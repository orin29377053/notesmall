import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const CommonProvider = ({ children }) => {
    const { user ,token} = useSelector((state) => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useNavigate();
   
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
                    created_at
                    documents{
                        _id title updated_at isDeleted isFavorite isArchived created_at content
                    }
                    projects{
                        _id name  documents {
                            _id title content updated_at isDeleted
                        }
                    }
                    tags{
                        _id name colorCode document{ _id title content  isDeleted }
                    }
                    `,
            },
        });
    };
    if (!user) {
        getUser(dispatch);
    }

    useEffect(() => {

        getUser(dispatch);
    }, []);

    

    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if (!localToken && token) {
            dispatch({ type: "LOGOUT" });
            //reload
            history("/home");
            window.location.reload();
        }
        dispatch({
            type: "UPDATE_PATH",
            payload: { path: location.pathname },
        });
    }, [location]);

    return <div>{children}</div>;
};

export default CommonProvider;
