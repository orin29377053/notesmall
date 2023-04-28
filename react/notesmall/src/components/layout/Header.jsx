import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Login from "../user/Login";
import { useSelector, useDispatch } from "react-redux";
import UserInfo from "../user/UserInfo";
import logo from "../../image/logo.png";
import { useNavigate } from "react-router-dom";
import { get } from "lodash";

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
    const dispatch = useDispatch();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                        padding: 6px 10px;
                        border-radius: 20px;
                        align-items: center;
                        cursor: pointer;
                        color: #1a77d3;

                        :hover {
                            background-color: #1a77d3;
                            color: #feffff !important;
                            box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
                                0px 4px 5px 0px rgba(0, 0, 0, 0.14),
                                0px 1px 10px 0px rgba(0, 0, 0, 0.12);
                        }
                    `}
                    onClick={handleOpen}
                >
                    <div
                        css={css`
                            margin-left: 5px;
                            font-size: 16px;
                            font-weight: 700;
                            margin-right: 10px;
                        `}
                    >
                        {role === "guest" ? "SIGN IN" : user?.email}
                    </div>
                    {role === "guest" ? (
                        <i className="fa-solid fa-right-to-bracket" style={{ color: "#1a77d3"}}>
                            
                        </i>
                    ) : (
                        <Avatar
                            alt="Orin"
                            src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                            sx={{ width: 30, height: 30 }}
                        />
                    )}
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
