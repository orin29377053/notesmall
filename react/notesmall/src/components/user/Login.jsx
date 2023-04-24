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
import note from "../../image/Taking notes-bro.svg";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { margin } from "@mui/system";

const Login = ({ setOpen }) => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [email, setEmail] = useState("test@gmail.com");
    const [password, setPassword] = useState("test");
    const signIn = (email, password) => {
        dispatch({
            type: "FETCH_SIGN_IN",
            payload: {
                gqlMethod: "mutation",
                api: "signin",
                format: `(email:"${email}",password:"${password}")`,
                response: `_id 
                email 
                token
                role 
                documents{
                    _id title updated_at isDeleted isFavorite isArchived created_at
                }
                projects{
                    _id name  documents {
                        _id title content updated_at isDeleted
                    }
                }`,
            },
        });
        setOpen(false);
        history("/home");
    };
    const signUp = (email, password) => {
        dispatch({
            type: "FETCH_SIGN_UP",
            payload: {
                gqlMethod: "mutation",
                api: "signup",
                format: `(email:"${email}",password:"${password}")`,
                response: `_id 
                email 
                token
                role 
                documents{
                    _id title updated_at isDeleted isFavorite isArchived created_at
                }
                projects{
                    _id name  documents {
                        _id title content updated_at isDeleted
                    }
                }`,
            },
        });
        setOpen(false);
        history("/home");
    };
    return (
        <div
            css={css`
                display: flex;
                flex-direction: row;
            `}
        >
            <Col>
                <img src={note} width="300" css={css``} />
            </Col>
            <Col
                css={css`
                    align-self: center;
                `}
            >
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                    `}
                >
                    <FormControl
                        sx={{ m: 2, width: "25ch" }}
                        variant="outlined"
                        required={true}
                        css={css`
                            margin-bottom: 10px;
                        `}
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Email
                        </InputLabel>

                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={"text"}
                            label="Email"
                            size="small"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ m: 2, width: "25ch" }}
                        variant="outlined"
                        required={true}
                        css={css`
                            margin-bottom: 10px;
                        `}
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>

                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? "text" : "password"}
                            defaultValue={password}
                            
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: "15ch", borderRadius: 3 }}
                        variant="outlined"
                        css={css`
                            align-self: center;
                        `}
                    >
                        <Button
                            variant="contained"
                            onClick={() => signIn(email, password)}
                            sx={{ borderRadius: 15 , fontWeight: 600 }}
                        >
                            Sign in
                        </Button>
                    </FormControl>
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
                                margin: 0px 10px;
                                min-width: 0px;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 20px;
                                color: rgb(112, 122, 138);
                            `}
                        >
                            Don't have an account yet?
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
                            onClick={() => signUp(email, password)}
                            sx={{ borderRadius: 15, fontWeight: 600 }}
                        >
                            Sign up
                        </Button>
                    </FormControl>
                </div>
            </Col>
        </div>
    );
};

export default Login;
