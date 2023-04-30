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
                    <span
                        style={{ color: "#1976d2", fontWeight: "bold" }}
                        key={j}
                    >
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
                margin-bottom: 10px;
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
                        justify-content: space-between;
                        padding-bottom: 3px;
                        border-bottom: 1px solid #e0e0e0;
                    `}
                >
                    <div
                        css={css`
                            font-size: 15px;
                            // color: #8e8e8e;

                        `}
                    >
                        {transformString[path.toString()]}
                    </div>
                    <div
                        css={css`
                            margin-left: 5px;
                            font-size: 10px;
                            color: #70737b;

                        `}
                    >
                        {item.length} {item.length > 1 ? "results" : "result"}{" "}
                        matching
                    </div>
                </div>
                {item.map((element, i) => (
                    <div
                        css={css`
                            margin-top: 10px;
                        `}
                        // className={
                        //     item.length - 1 !== i ? "needBottomBorder" : ""
                        // }
                        key={i}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            css={css`
                                font-size: 15px;
                                color: #8e8e8e;
                            `}
                        >
                            {highlightsprocess(element.texts)}
                        </Typography>
                    </div>
                ))}
            </CardContent>
        </div>
    );
};

export default HighlightsCard;
