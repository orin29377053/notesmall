import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Login from "../user/Login";
import { useSelector } from "react-redux";
import UserInfo from "../user/UserInfo";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
const userInfoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
const Header = () => {
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
    console.log(role);

    useEffect(() => {
        console.log("swsw", user);
    }, [user]);

    return (
        <div
            css={css`
                border-bottom: 1px solid #494949;
                padding: 5px 20px;
                background-color: #3f51b5;
                color: white;
                height: 50px;
                position: fixed;
                top: 0px;
                left: 0px;
                right: 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 100;
            `}
        >
            Header
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
                        padding: 3px 8px;
                        border-radius: 20px;
                        align-items: center;
                        cursor: pointer;
                        :hover {
                            background-color: #fff;
                            color: #3f51b5;
                        }
                    `}
                    onClick={handleOpen}
                >
                    <Avatar
                        alt="Orin"
                        src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                        sx={{ width: 30, height: 30 }}
                    />
                    {role === "guest" ? (
                        <div
                            css={css`
                                margin-left: 10px;
                                font-size: 14px;
                                font-weight: 600;
                            `}
                        >
                            Welcome to Notesmall
                        </div>
                    ) : (
                        <div
                            css={css`
                                margin-left: 10px;
                                font-size: 14px;
                                font-weight: 600;
                            `}
                        >
                            {user?.email}
                        </div>
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

                    {/* <Box sx={style}>
                        {role !== "guest" ? (
                            <UserInfo user={user} />
                        ) : (
                            <Login setOpen={setOpen} />
                        )}
                    </Box> */}
                </Modal>
                {/* <UserMenu /> */}
            </div>
        </div>
    );
};

export default Header;
