import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommonProvider = ({ children }) => {
    const { selectedID } = useSelector((state) => state.common);
    let history = useNavigate();
    useEffect(() => {
        history(`/${selectedID}`);
    }, [selectedID]);

    return <div>{children}</div>;
};

export default CommonProvider;
