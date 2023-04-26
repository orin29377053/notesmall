import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSelector, useDispatch } from "react-redux";
const AlertInformation = () => {
    const [visible, setVisible] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("Success");

    const { information } = useSelector((state) => state.common);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [visible]);

    useEffect(() => {
        setSeverity(information.type);
        setMessage(information.message);
        setTitle(information.title);
        setVisible(true);
    }, [information]);



    return (
        <>
            {visible && (
                <Alert severity={severity||"success"} className="alert-information">
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            )}
        </>
    );
};

export default AlertInformation;
