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
                    _id title updated_at isDeleted isFavorite isArchived
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
                    _id title updated_at isDeleted isFavorite isArchived
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
                <img src={note} width="300" />
            </Col>
            <Col>
                <div>
                    <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                        required={true}
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Email
                        </InputLabel>

                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={"text"}
                            label="Email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                        required={true}
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>

                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? "text" : "password"}
                            defaultValue={password}
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
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                    >
                        <Button
                            variant="contained"
                            onClick={() => signIn(email, password)}
                        >
                            Sign in
                        </Button>
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                    >
                        <Button
                            variant="contained"
                            onClick={() => signUp(email, password)}
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
