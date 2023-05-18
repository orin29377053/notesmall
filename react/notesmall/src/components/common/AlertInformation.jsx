import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useSelector, } from "react-redux";
const AlertInformation = () => {
    const [visible, setVisible] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("Success");
    const [key, setKey] = useState(0); // 添加key以强制组件重新渲染

    const { information } = useSelector((state) => state.common);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            setVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [visible]);

    useEffect(() => {
        if (!information || Object.keys(information).length === 0) {
            return;
        }
            setSeverity(information.type);
        setMessage(information.message);
        setTitle(information.title);
        setKey(key + 1); // 在更新通知内容时增加key，强制组件重新渲染

        setVisible(true);
    }, [information]);



    return (
        <>
            {visible && (
                <Alert  key={key}  severity={severity||"success"} className="alert-information">
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            )}
        </>
    );
};

export default AlertInformation;
