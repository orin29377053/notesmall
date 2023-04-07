/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "../App.css";

const getlistfromGraphql = (setList) => {
    console.log("getlist");
    const query = `query Query {
    documents {
        _id
        title
        updated_at
    }
    }`;
    fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    })
        .then((res) => res.json())
        .then((res) => {
            setList(res.data.documents);
        });
};

const List = ({ list }) => {
    return list?.map((item) => (
        <Link
            key={item._id}
            to={`/${item._id}`}
            css={css`
                text-decoration: none;
                color: white;
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
                    `}
                >
                    {item.title}
                </div>
                <div css={css``}>
                    {item.updated_at?.slice(0, 19).replace("T", " ")}
                </div>
            </div>
        </Link>
    ));
};

function Getlist() {
    // console.log("dd")

    const [list, setList] = useState();
    const getlist = () => {
        getlistfromGraphql(setList);
    };
    useEffect(() => {
        getlistfromGraphql(setList);
    }, []);

    return (
        <div>
            <div className="my-3 text-center">
                <Button
                    variant="contained"
                    color="warning"
                    onClick={getlist}
                    size="small"
                >
                    Refresh
                </Button>
            </div>
            <List list={list} />
        </div>
    );
}

export default Getlist;
