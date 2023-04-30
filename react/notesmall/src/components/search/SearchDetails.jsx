import React from "react";
import HighlightsCard from "./unit/HighlightsCard";
import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */

const SearchDetails = ({ highlights }) => {
    console.log(highlights);
    return (
        <div >
            {Object.keys(highlights).map((item, index) => (
                <>
                    <HighlightsCard key={index} item={highlights[item]} path={item} />

                </>
            ))}
        </div>
    );
};

export default SearchDetails;
