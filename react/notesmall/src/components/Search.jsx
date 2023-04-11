/** @jsxImportSource @emotion/react */

import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";

const SearchResult = ({ searchResult, goToDoc }) => {
    return searchResult?.map((item) => (
        <div
            key={item._id}
            onClick={() => goToDoc(item._id)}
            to={`/${item._id}`}
            css={css`
                text-decoration: none;
                background-color: white;
                color: #474747;
            `}
        >
            <div
                css={css`
                    border: 1px solid #c7c7c7;
                    padding: 8px 20px;
                    margin: 10px 0;
                    border-radius: 5px;
                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
                    }
                `}
            >
                <div
                    key={item._id}
                    css={css`
                        font-size: 1.2rem;
                        font-weight: 600;
                    `}
                >
                    {item.title}
                </div>
                <div
                    css={css`
                        font-size: 0.8rem;
                    `}
                >
                    {item.content
                        .replace(/[#*!()\[\]<>]-/g, "")
                        .substring(0, 100) + " ..."}
                </div>
            </div>
        </div>
    ));
};
const fetchToSearch = debounce((dispatch, keyword) => {
    if (keyword) {
        dispatch({
            type: "SEARCH_LIST",
            payload: {
                gqlMethod: "query",
                api: "searchDocuments",
                format: `(keyword: "${keyword}")`,
                response: "_id title content",
            },
        });
    } else {
    }
}, 1000);

const Search = () => {
    const dispatch = useDispatch();
    const keyword = useSelector((state) => state.common.searchKeyword);

    useEffect(() => {
        if (keyword) {
            fetchToSearch(dispatch, keyword);
        }
    }, [keyword]);

    const { searchResult } = useSelector((state) => state.common);
    const goToDoc = (id) => {
        dispatch({
            type: "CHANGE_DOCUMENT",
            payload: { id },
        });
    };
    return (
        <div>
            <TextField
                id="outlined-basic"
                label="搜尋筆記"
                variant="outlined"
                onChange={(e) => {
                    dispatch({
                        type: "SEARCH_KEYWORD",
                        payload: { keyword: e.target.value },
                    });
                }}
            />
            <div>
                <SearchResult searchResult={searchResult} goToDoc={goToDoc} />
            </div>
        </div>
    );
};

export default Search;
