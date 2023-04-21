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

    return (
        <Card
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
                <h6 className="mb-1 fw-bold">{path.toUpperCase()}</h6>
                {item.map((element, i) => (
                    <div
                        css={css`
                            margin-left: 15px;
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
        </Card>
    );
};

export default HighlightsCard;
