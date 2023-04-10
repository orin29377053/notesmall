/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import "../App.css";

const List = ({ list }) => {
    return list?.map((item) => (
        <Link
            key={item._id}
            to={`/${item._id}`}
            css={css`
                text-decoration: none;
                color: #dedede;

                &:hover {
                    color: black;
                }
            `}
        >
            <div
                css={css`
                    border-bottom: 1px solid #494949;
                    padding: 8px 20px;
                    &:hover {
                        background-color: #c5c5c5;
                        color: #474747;
                    }
                `}
            >
                <div
                    css={css`
                        font-weight: bold;
                        font-size: 1.2rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    `}
                >
                    {item.title}
                </div>
                <div
                    css={css`
                        font-size: small;
                    `}
                >
                    {item.updated_at?.slice(0, 19).replace("T", " ")}
                </div>
            </div>
        </Link>
    ));
};

function Getlist() {
    const { sidebar } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const getlist = () => {
        dispatch({
            type: "FETCH_SIDEBAR_LIST",
            payload: {
                gqlMethod: "query",
                api: "documents",
                format: "(isDeleted: false)",
                response: "_id title updated_at",
            },
        });
    };
    useEffect(() => {
        getlist();
    }, []);

    return (
        <div>
            <div className="my-3 text-center">
                {/* <Button
                    variant="text"
                    color="warning"
                    onClick={getlist}
                    size="small"
                    startIcon={<CachedIcon />}
                >
                    Refresh
                </Button> */}
            </div>
            <List list={sidebar} />
        </div>
    );
}

export default Getlist;
