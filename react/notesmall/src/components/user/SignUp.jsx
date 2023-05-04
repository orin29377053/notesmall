/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { graphqlAPI } from "../../utils/const";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setSignupform ,setOpen}) => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState({
        status: false,
        message: "",
    });
    const [passwordError, setPasswordError] = useState({
        status: false,
        message: "",
    });
    const [checkPasswordError, setCheckPasswordError] = useState({
        status: false,
        message: "",
    });
    const [canSignUp, setCanSignUp] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const signUp = async (email, password) => {
        const query = `
        mutation{
            signup(email:"${email}",password:"${password}"){
                _id 
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
                    _id name colorCode document{ _id title content  isDeleted  }
                }
            }
        }
        `;
        const response = await fetch(graphqlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: "",
            },
            body: JSON.stringify({ query }),
        }).then((res) => res.json());

        if (response.errors) {
            setEmailError({
                status: true,
                message:
                    response.errors[0]?.message ?? "Unknown error occurred",
            });
            return;
        } else {
            dispatch({
                type: "FETCH_SIGN_UP",
                payload: response,
            });
            setOpen(false);
            history("/home");
        }


        // setOpen(false);
        // history("/home");
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setSignUpEmail(email);

        // 檢查email是否符合正確格式
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        const isValidEmail = emailRegex.test(email);
        if (isValidEmail) {
            setEmailError({ status: false, message: "" });
        } else {
            setEmailError({
                status: true,
                message: "Please enter a valid email address",
            });
        }
    };
    const validatePasswordFormat = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
        return regex.test(password);
    };
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setSignUpPassword(password);

        if (password.length > 0 && !validatePasswordFormat(password)) {
            setPasswordError({
                status: true,
                message:
                    " Should between 8-12 characters , at least 1 number, 1 uppercase letter, 1 lowercase letter.",
            });
        } else {
            setPasswordError({ status: false, message: "" });
        }
    };
    const handleCheckPasswordChange = (e) => {
        const password = e.target.value;
        setCheckPassword(password);

        if (password !== signUpPassword) {
            setCheckPasswordError({
                status: true,
                message: "Passwords do not match.",
            });
        } else {
            setCheckPasswordError({ status: false, message: "" });
        }
    };

    useEffect(() => {
        if (
            emailError.status === false &&
            passwordError.status === false &&
            checkPasswordError.status === false &&
            signUpEmail !== "" &&
            signUpPassword !== "" &&
            checkPassword !== ""
        ) {
            setCanSignUp(true);
        } else {
            setCanSignUp(false);
        }
    }, [
        emailError.status,
        passwordError.status,
        checkPasswordError.status,
        signUpEmail,
        signUpPassword,
        checkPassword,
    ]);

    return (
        <>
            <FormControl
                sx={{ m: 2, width: "25ch" }}
                variant="outlined"
                required={true}
                css={css`
                    margin-bottom: 10px;
                `}
            >
                <InputLabel htmlFor="2" size="small">
                    Email
                </InputLabel>

                <OutlinedInput
                    error={emailError.status}
                    id="2"
                    type={"text"}
                    label="1Email"
                    size="small"
                    onChange={handleEmailChange}
                    helperText={emailError.message}
                />
                {emailError.status === false ? (
                    <div
                        css={css`
                            font-size: 12px;
                            color: rgb(112, 122, 138);
                            margin-left: 5px;
                        `}
                    >
                        Ex: example@domain.com
                    </div>
                ) : (
                    <div
                        css={css`
                            font-size: 12px;
                            color: #f44336;
                            margin-left: 5px;
                        `}
                    >
                        {emailError.message}
                    </div>
                )}
            </FormControl>
            <FormControl
                sx={{ m: 2, width: "25ch" }}
                variant="outlined"
                required={true}
                css={css`
                    margin-bottom: 10px;
                `}
            >
                <InputLabel htmlFor="3" size="small">
                    Password
                </InputLabel>

                <OutlinedInput
                    id="3"
                    type={showPassword ? "text" : "password"}
                    error={passwordError.status}
                    size="small"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    onChange={handlePasswordChange}
                />
                {passwordError.status === false ? (
                    <div
                        css={css`
                            font-size: 11px;
                            color: rgb(112, 122, 138);
                            margin-left: 5px;
                        `}
                    >
                        Should between 8-12 characters , at least 1 number, 1
                        uppercase letter, 1 lowercase letter.
                    </div>
                ) : (
                    <div
                        css={css`
                            font-size: 11px;
                            color: #f44336;
                            margin-left: 5px;
                        `}
                    >
                        {passwordError.message}
                    </div>
                )}
            </FormControl>
            <FormControl
                sx={{ m: 2, width: "25ch" }}
                variant="outlined"
                required={true}
                css={css`
                    margin-bottom: 10px;
                `}
            >
                <InputLabel htmlFor="outlined-adornment-password" size="small">
                    Check Password
                </InputLabel>

                <OutlinedInput
                    id="4"
                    type="password"
                    size="small"
                    label="Check Password"
                    error={checkPasswordError.status}
                    onChange={handleCheckPasswordChange}
                />
                {checkPasswordError.status === false ? (
                    <div
                        css={css`
                            font-size: 12px;
                            color: rgb(112, 122, 138);
                            margin-left: 5px;
                        `}
                    >
                        Please enter your password again
                    </div>
                ) : (
                    <div
                        css={css`
                            font-size: 12px;
                            color: #f44336;
                            margin-left: 5px;
                        `}
                    >
                        {checkPasswordError.message}
                    </div>
                )}
            </FormControl>

            <FormControl
                sx={{ m: 1, width: "15ch" }}
                variant="outlined"
                css={css`
                    align-self: center;
                    margin-top: 15px;
                `}
            >
                <Button
                    variant="outlined"
                    onClick={() => signUp(signUpEmail, signUpPassword)}
                    disabled={!canSignUp}
                    // onClick={() => setSignupform(false)}
                    sx={{ borderRadius: 15, fontWeight: 600 }}
                >
                    Sign up
                </Button>
            </FormControl>
            {/* <FormControl
            sx={{ m: 1, width: "15ch", borderRadius: 3 }}
            variant="outlined"
            css={css`
                align-self: center;
            `}
        >
            <Button
                variant="contained"
                onClick={() => signIn(email, password)}
                sx={{ borderRadius: 15, fontWeight: 600 }}
            >
                Sign in
            </Button>
        </FormControl> */}
            <div
                css={css`
                    box-sizing: border-box;
                    margin-top: 15px;

                    min-width: 0px;
                    display: flex;
                    -webkit-box-align: center;
                    align-items: center;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                `}
            >
                <div
                    css={css`
                        box-sizing: border-box;
                        margin: 0px;
                        min-width: 0px;
                        height: 1px;
                        flex: 1 1 0%;
                        background-color: rgb(234, 236, 239);
                    `}
                />
                <div
                    css={css`
                        box-sizing: border-box;
                        cursor: pointer;

                        margin: 0px 10px;
                        min-width: 0px;
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: rgb(112, 122, 138);
                        padding: 3px;
                        :hover {
                            color: #1976d2;
                            font-weight: 600;
                        }
                    `}
                    onClick={() => setSignupform(false)}
                >
                    Back to sign in &ensp;
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </div>
                <div
                    css={css`
                        box-sizing: border-box;
                        margin: 0px;
                        min-width: 0px;
                        height: 1px;
                        flex: 1 1 0%;
                        background-color: rgb(234, 236, 239);
                    `}
                />
            </div>
        </>
    );
};

export default SignUp;
