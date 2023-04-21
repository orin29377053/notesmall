/** @jsxImportSource @emotion/react */

import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import SearchResult from "./search/SearchResult";


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
                <SearchResult searchResult={searchResult} />
            </div>
            {/* <Test /> */}
        </div>
    );
};

export default Search;
