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
        // dispatch({
        //     type: "FETCH_RESULT_INFORMATION", data: {
        //         type: "success",
        //         title: "Success",
        //         message: "Logout successfully",
        //     }
        //  });
    };

    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                padding: 20px 30px;
                margin: 20px;
            `}
        >
            <Avatar
                alt="Orin"
                src="https://image.notesmall.site/resized-mypic.jpeg"
                sx={{ width: 200, height: 200 }}
            />
            <div
                css={css`
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    margin-top: 10px;
                    color: #213864;
                `}
            >
                {user?.email}
            </div>
            <div
                css={css`
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                `}
            >
                <div
                    css={css`
                        border-right: 1px solid grey;
                        width: 100px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    `}
                >
                    <div
                        css={css`
                            font-size: 65px;
                            color: #213864;
                        `}
                    >
                        {user?.documents?.length}
                    </div>
                    <div
                        css={css`
                            font-size: 10px;
                            color: #213864;
                            font-weight: bold;
                        `}
                    >
                        Documents
                    </div>
                </div>

                <div
                    css={css`
                        width: 100px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    `}
                >
                    <div
                        css={css`
                            font-size: 65px;
                            color: #213864;
                        `}
                    >
                        {user?.projects?.length}
                    </div>
                    <div
                        css={css`
                            font-size: 10px;
                            color: #213864;
                            font-weight: bold;
                        `}
                    >
                        Projects
                    </div>
                </div>
            </div>
            <Button
                variant="contained"
                onClick={() => {
                    logout();
                    // updateTag(id);
                    handleClose();
                }}
                css={css`
                    margin-top: 20px;
                    float: right;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                `}
            >
                logout
            </Button>
        </div>
    );
};

export default UserInfo;
