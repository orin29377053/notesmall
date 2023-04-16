/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import sanitizeContent from "../../../utils/sanitizeContent"
import React, { useState } from "react";
import { Card, CardContent, Typography, Collapse } from "@mui/material";
const HighlightsCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    function removeLinkInBrackets(text) {
        const pattern = /\[(.*?)\]\((.*?)\)/g;
        return text.replace(pattern, '$1');
    }
    
    const highlightsprocess = (data) => {
        return data.map((item) => {
            if (item.type === "hit") {
                return (
                    <span style={{ backgroundColor: "lightgreen" }}>
                        {sanitizeContent(item.value)}
                    </span>
                );
            } else {
                return sanitizeContent(removeLinkInBrackets(item.value));
            }
        });
    };
    
    const content = highlightsprocess(item.texts);
    console.log(content, "content")

    return (
        <Card>
            <CardContent css={css`
            padding: 3px 3px 3px 3px;
            :last-child {
                padding-bottom: 3px;
            }
            width: 500px;
            
            `} >
                <Typography variant="subtitle2" color="textSecondary">
                    {item.path}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {content.length < 20 ? (
                        content
                    ) : (
                        <>
                            {expanded ? content : `${content.slice(0, 20)}`}
                            <span
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={handleExpandClick}
                            >
                                {expanded ? "收合" : "展開"}
                            </span>
                        </>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default HighlightsCard;