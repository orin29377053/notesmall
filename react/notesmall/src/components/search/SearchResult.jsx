/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


import React from 'react';
import SearchDetails from './SearchDetails';
import DocumentCard from '../Card';
import sanitizeContent from '../../utils/sanitizeContent';
import extractImageURL from '../../utils/extractImageURL';





const SearchResult = ({ searchResult }) => {
    return searchResult?.map((item) => (
        <div>
            <DocumentCard
                title={item.title}
                content={sanitizeContent(item.content)}
                _id={item._id}
                image={extractImageURL(item.content)}
            />
            <SearchDetails highlights={item.highlights} />

        </div>
    ));
};

export default SearchResult;