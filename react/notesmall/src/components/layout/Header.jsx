import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";

const Header = () => {
    return (
        <div
            css={css`
                border-bottom: 1px solid #494949;
                padding: 5px 20px;
                background-color: #3f51b5;
                color: white;
                top: 0;
                position: sticky;
                height: 50px;
                z-index: 100;
                
            `}
        >
            Header
            <div css={css`
                float: right;
                align-items: center;

            
            `}>
                <Avatar
                    alt="Orin"
                    src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                    sx={{ width: 30, height: 30 }}
                />
            </div>
        </div>
    );
};

export default Header;
