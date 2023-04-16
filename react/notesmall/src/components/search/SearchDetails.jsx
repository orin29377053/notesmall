

import React from "react";
import HighlightsCard from "./unit/HighlightsCard";

const SearchDetails = ({highlights}) => {
    return (
        <div>
            {highlights.map((item, index) => (
                <HighlightsCard key={index} item={item} />
            ))}
        </div>
    );
};

export default SearchDetails;
