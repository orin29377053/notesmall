/** @jsxImportSource @emotion/react */

import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

import DocumentCard from "./Card";

const SearchResult = ({ searchResult, goToDoc }) => {
    function extractImageURL(content) {
        const regex = /(https?:\/\/[^\s]*?\.(?:png|jpg|jpeg|gif))/gi;
        const matches = content.match(regex);
        return matches ? matches[0] : null;
    }
    function sanitizeContent(content) {
        const text = content
            .replace(/[#*!()\[\]<>]-/g, "") // 刪除所有的符號
            .replace(/(#+)/g, ""); // 刪除所有的井號（#）
        return text.substring(0, 100) + "...";
    }
    return searchResult?.map((item) => (
        <div>
            <DocumentCard
                title={item.title}
                content={sanitizeContent(item.content)}
                _id={item._id}
                image={extractImageURL(item.content)}
            />
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
