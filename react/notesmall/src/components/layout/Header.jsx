import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Login from "../user/Login";
import { useSelector } from "react-redux";
import UserInfo from "../user/UserInfo";
import logo from "../../image/logo.png";
import { useNavigate } from "react-router-dom";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 3,

    // border: "2px solid #000",
    boxShadow: 10,
    p: 3,
};
const userInfoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    borderRadius: 3,

    // border: "2px solid #000",
    boxShadow: 10,
};
const Header = () => {
    const history = useNavigate();
    const { user } = useSelector((state) => state.user);
    const email = user?.email;
    const role = user?.role;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {}, [user]);

    return (
        <div
            css={css`
                background-image: none;
                padding: 5px 20px;
                height: 60px;
                position: fixed;
                top: 0px;
                left: 0px;
                right: 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 100;
                backdrop-filter: blur(8px);
                border-style: solid;
                border-color: rgb(231, 235, 240);
                border-width: 0px 0px thin;
                background-color: rgba(255, 255, 255, 0.9);
                color: rgb(45, 56, 67);
            `}
        >
            <img
                src={logo}
                css={css`
                    width: 150px;
                    cursor: pointer;
                `}
                onClick={() => {
                    history("/home");
                }}

            />
            <div
                css={css`
                    float: right;
                    align-items: center;
                `}
            >
                <div
                    css={css`
                        display: flex;
                        border: 1px solid white;
                        padding: 8px 10px;
                        border-radius: 20px;
                        align-items: center;
                        cursor: pointer;
                        :hover {
                            background-color: #ecf1fe;
                            color: #1976d2;
                        }
                    `}
                    onClick={handleOpen}
                >
                    <div
                        css={css`
                            margin-left: 10px;
                            font-size: 16px;
                            font-weight: 700;
                            margin-right: 10px;
                        `}
                    >
                        {role === "guest"
                            ? "Welcome to Notesmall"
                            : user?.email}
                    </div>

                    <Avatar
                        alt="Orin"
                        src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                        sx={{ width: 30, height: 30 }}
                    />
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {role !== "guest" ? (
                        <Box sx={userInfoStyle}>
                            <UserInfo user={user} handleClose={handleClose} />
                        </Box>
                    ) : (
                        <Box sx={style}>
                            <Login setOpen={setOpen} />
                        </Box>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Header;
