/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import SearchResult from "./search/SearchResult";
import searchImage from "../image/Personal files-rafiki.svg";
import { graphqlAPI } from "../utils/const";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

const fetchToSearch = debounce((dispatch, keyword) => {
    if (keyword) {
        dispatch({
            type: "SEARCH_LIST",
            payload: {
                gqlMethod: "query",
                api: "searchDocuments",
                format: `(keyword: "${keyword}")`,
                response: `_id title
                content
                score
                tags {
                  name
                  colorCode
                }
                highlights {
                  path
                  score
                  texts {
                    type
                    value
                  }
                } `,
            },
        });
    } else {
    }
}, 1000);

const Search = () => {
    const dispatch = useDispatch();
    let history = useNavigate();
    const [autoCompleteKeyword, setAutoCompleteKeyword] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    const keyword = useSelector((state) => state.common.searchKeyword);
    const autoComplete = async (keyword) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch({ type: "LOGOUT" });
            history("/home");
            return;
        }
        if (keyword) {
            const query = `
                        query{
                            autoComplete(keyword: "${keyword}") }
                            `;
            const resul = await fetch(graphqlAPI, {
                method: "POST",
                body: JSON.stringify({ query }),
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            const result = await resul.json();
            // console.log(result);
            setAutoCompleteKeyword(result.data.autoComplete);
        } else {
        }
    };
    useEffect(() => {
        if (keyword) {
            fetchToSearch(dispatch, keyword);
        }
    }, [keyword]);

    // useEffect(() => {
    //     console.log(searchKeyword);
    // }, [searchKeyword]);

    const { searchResult } = useSelector((state) => state.common);
    return (
        <div
            css={css`
                margin: 20px;
            `}
        >
            <div
                css={css`
                    display: flex;
                    align-items: center;
                `}
            >
                <div
                    css={css`
                        font-size: 20px;
                        font-weight: bold;
                    `}
                >
                    I want to know about
                </div>
                {/* <TextField
                    id="outlined-basic"
                    label="somethings..."
                    variant="outlined"
                    size="small"
                    // onChange={(e) => {
                    //     dispatch({
                    //         type: "SEARCH_KEYWORD",
                    //         payload: { keyword: e.target.value },
                    //     });
                    // }}
                    onChange={(e) => {
                        autoComplete(e.target.value);
                    }}
                    sx={{ ml: 1 }}
                /> */}
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    disabledItemsFocusable={false}
                    options={autoCompleteKeyword?.map((option) => option)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="somethings...     (Press Enter to search)"
                            onChange={(e) => {
                                autoComplete(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    dispatch({
                                        type: "SEARCH_KEYWORD",
                                        payload: { keyword: e.target.value },
                                    });
                                }
                            }}
                        />
                    )}
                    css={css`
                        width: 50%;
                        margin-left: 10px;
                    `}
                    size="small"
                />
            </div>
            {searchResult?.length > 0 ? (
                <div
                    css={css`
                        margin-top: 1px;
                    `}
                >
                    <SearchResult searchResult={searchResult} />
                </div>
            ) : (
                <img src={searchImage} width="50%" css={css``} />
            )}
        </div>
    );
};

export default Search;
