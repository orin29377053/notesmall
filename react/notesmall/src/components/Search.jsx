/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import SearchResult from "./search/SearchResult";
import searchImage from "../image/Personal files-rafiki.svg";

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
    const keyword = useSelector((state) => state.common.searchKeyword);

    useEffect(() => {
        if (keyword) {
            fetchToSearch(dispatch, keyword);
        }
    }, [keyword]);

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
                <TextField
                    id="outlined-basic"
                    label="somethings..."
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                        dispatch({
                            type: "SEARCH_KEYWORD",
                            payload: { keyword: e.target.value },
                        });
                    }}
                    sx={{ ml: 1 }}
                    
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
                
                (<img src={searchImage} width="50%" css={css``} />)
            )}
        </div>
    );
};

export default Search;
