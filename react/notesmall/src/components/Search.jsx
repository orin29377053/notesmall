/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import SearchResult from "./search/SearchResult";
import searchImage from "../image/Search engines-bro.svg";
import notFoundImage from "../image/No data-bro.svg";

import { graphqlAPI } from "../utils/const";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

// const fetchToSearch = debounce((dispatch, keyword) => {
//     if (keyword) {
//         dispatch({
//             type: "SEARCH_LIST",
//             payload: {
//                 gqlMethod: "query",
//                 api: "searchDocuments",
//                 format: `(keyword: "${keyword}")`,
//                 response: `_id title
//                 content
//                 score
//                 tags {
//                   name
//                   colorCode
//                 }
//                 highlights {
//                   path
//                   score
//                   texts {
//                     type
//                     value
//                   }
//                 } `,
//             },
//         });
//     } else {
//     }
// }, 1000);

const fetchSearch = (dispatch, keyword) => {
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
};

const Search = () => {
    const dispatch = useDispatch();
    let history = useNavigate();
    const [autoCompleteKeyword, setAutoCompleteKeyword] = useState([]);
    const { searchResult } = useSelector((state) => state.common);

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
            setAutoCompleteKeyword(result.data.autoComplete);
        } else {
        }
    };

    useEffect(() => {
        console.log("searchResult", searchResult);
    }, [searchResult]);

    useEffect(() => {
        if (searchResult[0] === "No result found") {
            dispatch({ type: "CLEAR_SEARCH_RESULT" });
        }
    }, []);

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
                    `}
                >
                    I want to know about
                </div>

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
                                    fetchSearch(dispatch, e.target.value);
                                    // dispatch({
                                    //     type: "SEARCH_KEYWORD",
                                    //     payload: { keyword: e.target.value },
                                    // });
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
                searchResult[0] === "No result found" ? (
                    <>
                        <div
                            css={css`
                                margin-top: 10px;
                                color: #1976d2;
                                font-size: 20px;
                                font-weight: 700;
                            `}
                        >
                            There is found 0 relevant document
                        </div>
                        <div
                            css={css`
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                flex-direction: row;
                            `}
                        >
                            <img
                                src={notFoundImage}
                                alt="notFoundImage"
                                css={css`
                                    width: 440px;
                                `}
                            />
                            <div
                                css={css`
                                    color: #6c757d;
                                    width: 400px;
                                    font-size: 1.5rem;
                                    
                                `}
                            >
                                Nothing Found? No Worries, Try Searching from a
                                Different Angle!
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        css={css`
                            margin-top: 1px;
                        `}
                    >
                        <SearchResult searchResult={searchResult} />
                    </div>
                )
            ) : (
                <div
                    css={css`
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        flex-direction: row;
                    `}
                >
                    <div
                        css={css`
                            color: #6c757d;
                            width: 400px;
                            font-size: 1.5rem;
                        `}
                    >
                        Discover Your Documents Like Never Before with Our
                        Intuitive Search.
                    </div>
                    <img
                        src={searchImage}
                        alt="searchImage"
                        css={css`
                            width: 440px;
                        `}
                    />
                </div>
            )}
        </div>
    );
};

export default Search;
