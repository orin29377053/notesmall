/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import sanitizeContent from "../../../utils/sanitizeContent";
import { Card, CardContent, Typography } from "@mui/material";
const HighlightsCard = ({ item, path }) => {
    function removeLinkInBrackets(text) {
        const pattern = /\[(.*?)\]\((.*?)\)/g;
        return text.replace(pattern, "$1");
    }

    const highlightsprocess = (data) => {
        return data.map((ele, j) => {
            if (ele.type === "hit") {
                return (
                    <span style={{ backgroundColor: "lightgreen" }} key={j}>
                        {sanitizeContent(ele.value)}
                    </span>
                );
            } else {
                return sanitizeContent(removeLinkInBrackets(ele.value));
            }
        });
    };
    const transformString = {
        title: "Title",
        content: "Content",
        "images.autoTags": "Images autotags",
    };

    return (
        <div
            css={css`
                padding: 5px;
                margin-bottom: 5px;
            `}
        >
            <CardContent
                css={css`
                    padding: 3px 3px 3px 3px;
                    :last-child {
                        padding-bottom: 3px;
                    }
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
                            border-radius: 12px;
                            boarder: 2px solid #1976d2;
                            background-color: #ecf1fe;
                            padding: 2px 10px 2px 10px;
                            font-size: 14px;
                            font-weight: 700;
                            box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.2);
                            color: #1976d2;
                        `}
                    >
                        {transformString[path.toString()]}
                    </div>
                    <div css={css`
                    margin-left: 5px;
                    font-size: 12px;
                    
                    `}>
                        {item.length} {item.length > 1 ? "results" : "result"}{" "}
                        matching
                    </div>
                </div>
                {item.map((element, i) => (
                    <div
                        css={css`
                            margin-left: 5px;
                            margin-top: 10px;
                        `}
                        className={
                            item.length - 1 !== i ? "needBottomBorder" : ""
                        }
                        key={i}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {highlightsprocess(element.texts)}
                        </Typography>
                    </div>
                ))}
            </CardContent>
        </div>
    );
};

export default HighlightsCard;
