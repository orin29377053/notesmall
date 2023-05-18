import React from "react";
import List from "@mui/material/List";

import DocumentListItem from "./unit/DocumentListItem";

const FavoriteDocument = ({ list }) => {
    return (
        <List dense={true}>
            <DocumentListItem list={list} />
        </List>
    );
};

export default FavoriteDocument;
