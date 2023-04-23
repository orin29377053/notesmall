/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserInfo = ({ user, handleClose }) => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        //reload
        history("/home");
        window.location.reload();
    };

    return (
        <div
            css={css`
                display: flex;
                justify-content: space-around;
            `}
        >
            <Avatar
                alt="Orin"
                src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                sx={{ width: 200, height: 200 }}
            />
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                `}
            >
                <div>{user?.email}</div>
                <div>{user?.role}</div>
                <div>Documents:{user?.documents?.length}</div>
                <div>Projects:{user?.projects?.length}</div>
                <div
                    css={css`
                        right: 30px;
                    `}
                >
                    <Button
                        variant="contained"
                        onClick={() => {
                            logout();
                            // updateTag(id);
                            handleClose();
                        }}
                        css={css`
                            margin-top: 10px;
                            float: right;
                        `}
                    >
                        logout
                    </Button>
                    {/* <Button
                            variant="contained"
                            // onClick={() => {
                            //     deleteTag(id);
                            //     handleClose();
                            // }}
                            color="error"

                            css={css`
                                margin-top: 10px;
                                float: left;
                            `}
                        >
                            DELETE
                        </Button> */}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
