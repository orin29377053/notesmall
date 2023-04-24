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
                background-color: #edf8ff;

            `}
        >
            <div>
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                        padding: 20px 30px;
                        margin: 20px;
                        border-radius: 10px;
                        background-color: white;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);

                     
                    `}
                >
                    <Avatar
                        alt="Orin"
                        src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
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
                    {/* <div
                    css={css`
                        font-size: 16px;
                        margin-bottom: 10px;
                    `}
                >
                    {user?.role}
                </div> */}
                    {/* <hr width="100%"  align="center" /> */}
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
                    {/* <hr width="100%"  align="center" /> */}
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
                {/* <div
                    css={css`
                        font-size: 14px;
                        margin-bottom: 10px;
                    `}
                > */}
                {/* <span
                        css={css`
                            font-weight: bold;
                            margin-right: 5px;
                        `}
                    >
                        Documents:
                    </span>{" "}
                    {user?.documents?.length}
                    <br></br>
                    <span
                        css={css`
                            font-weight: bold;
                            margin-right: 5px;
                        `}
                    >
                        Projects:
                    </span>{" "}
                    {user?.projects?.length} */}
                {/* <div>Documents:{user?.documents?.length}</div>
                    <div>Projects:{user?.projects?.length}</div> */}
                {/* </div> */}

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
    );
};

export default UserInfo;
