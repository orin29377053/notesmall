import sanitizeContent from "../utils/sanitizeContent";
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

    return (
        <Card>
            <CardContent >
                <Typography variant="subtitle1" color="textSecondary">
                    {item.path}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {content.toString().length < 20 ? (
                        content
                    ) : (
                        <>
                            {expanded ? content : `${content.slice(0, 20)}...`}
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

const Test = () => {
    const dd = {
        _id: "6430fc64b589b749cd3ce128",
        title: "MongoDB Atlas",
        content:
            "### 基本介紹\n\n[https://www.youtube.com/watch?v=1EaOihoxyoE&ab\\_channel=MongoDB](https://www.youtube.com/watch?v=1EaOihoxyoE&ab_channel=MongoDB)\n\n> 这段视频介绍了 MongoDB Atlas，这是一个开发者数据平台，提供一个直观的文档模型，可以将数据映射到对象和代码上，同时数据架构可以随时间演化以适应任何类型的数据。它提供了一个强大的查询 API，可以运行从简单的查找操作到多阶段聚合的统一接口，还提供全文搜索和实时分析等功能，用于个性化的洞察。该平台提供了诸如无缝和弹性计算和存储扩展、自动化和完全托管的数据分层归档、索引建议和跨两个或多个云提供商的多云集群等功能。该视频鼓励开发者使用 MongoDB Atlas 开始构建伟大的东西。\n\n[https://www.mongodb.com/zh-cn/atlas/search](https://www.mongodb.com/zh-cn/atlas/search)\n\n### MongoDB Atlas 跟 js做連結\n\n[https://dev.to/dalalrohit/how-to-connect-to-mongodb-atlas-using-node-js-k9i](https://dev.to/dalalrohit/how-to-connect-to-mongodb-atlas-using-node-js-k9i)\n\n### Atlas search\n\n使用案例：\n\n[https://askstw.medium.com/mongodb-atlas-search-basic-4769816e48aa](https://askstw.medium.com/mongodb-atlas-search-basic-4769816e48aa)\n\n使用Atlas Search非**常的簡**單，其實從頭到尾只要做一件事情，就是建立Search Index，然後就能夠進行全文檢索。而 Atlas Search Index 使用的是 \\_Lucene Index (inverted index)\\_，也是依賴Analyzer進行分詞存放與索引，有用過搜尋資料庫應該都不陌生。",
        score: 2.4583168029785156,
        tags: [],
        highlights: [
            {
                path: "content",
                score: 1.1519922018051147,
                texts: [
                    {
                        type: "text",
                        value: "v=1EaOihoxyoE&ab\\_channel=",
                    },
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: "](https://www.youtube.com/watch?",
                    },
                ],
            },
            {
                path: "content",
                score: 1.258767008781433,
                texts: [
                    {
                        type: "text",
                        value: "v=1EaOihoxyoE&ab_channel=",
                    },
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: ")\n\n> 这段视频介绍了 ",
                    },
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: " Atlas，这是一个开发者数据平台，提供一个直观的文档模型，可以将数据映射到对象和代码上，同时数据架构可以随时间演化以适应任何类型的数据。",
                    },
                ],
            },
            {
                path: "content",
                score: 1.303410530090332,
                texts: [
                    {
                        type: "text",
                        value: "该视频鼓励开发者使用 ",
                    },
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: " Atlas 开始构建伟大的东西。\n\n",
                    },
                ],
            },
            {
                path: "content",
                score: 1.0442314147949219,
                texts: [
                    {
                        type: "text",
                        value: "[https://www.mongodb.com/zh-cn/atlas/search](https://www.mongodb.com/zh-cn/atlas/search)\n\n### ",
                    },
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: " Atlas 跟 js做連結\n\n[https://dev.to/dalalrohit/how-to-connect-to-",
                    },
                    {
                        type: "hit",
                        value: "mongodb",
                    },
                    {
                        type: "text",
                        value: "-atlas-using-node-js-k9i](https://dev.to/dalalrohit/how-to-connect-to-",
                    },
                    {
                        type: "hit",
                        value: "mongodb",
                    },
                    {
                        type: "text",
                        value: "-atlas-using-node-js-k9i)\n\n### Atlas search\n\n使用案例：\n\n[https://askstw.medium.com/",
                    },
                    {
                        type: "hit",
                        value: "mongodb",
                    },
                    {
                        type: "text",
                        value: "-atlas-search-basic-4769816e48aa](https://askstw.medium.com/",
                    },
                    {
                        type: "hit",
                        value: "mongodb",
                    },
                    {
                        type: "text",
                        value: "-atlas-search-basic-4769816e48aa)\n\n使用Atlas Search非**常的簡**單，其實從頭到尾只要做一件事情，就是建立Search Index，然後就能夠進行全文檢索。",
                    },
                ],
            },
            {
                path: "title",
                score: 1.3923239707946777,
                texts: [
                    {
                        type: "hit",
                        value: "MongoDB",
                    },
                    {
                        type: "text",
                        value: " Atlas",
                    },
                ],
            },
        ],
    };
    const data = [
        {
            type: "text",
            value: "影片內容展示了如何從頭開始構建博客，包括編輯和刪除文章、",
        },
        {
            type: "hit",
            value: "Markdown",
        },
        {
            type: "text",
            value: "轉HTML\\[\\[",
        },
        {
            type: "hit",
            value: "Markdown",
        },
        {
            type: "text",
            value: " to jsx\\]\\]等。\n",
        },
    ];
    const highlightsprocess = (data) => {
        return data.map((item) => {
            if (item.type === "hit") {
                return (
                    <span style={{ backgroundColor: "lightgreen" }}>
                        {item.value}
                    </span>
                );
            } else {
                return item.value;
            }
        });
    };
    const renderData = dd.highlights
        .flatMap((item) =>
            item.texts.map((text) => ({
                path: item.path,
                value: text.value,
                type: text.type,
            }))
        )
        .map((item, index) => {
            if (item.type === "hit") {
                return (
                    <li key={index}>
                        <span>{item.path}</span>
                        <span style={{ backgroundColor: "lightgreen" }}>
                            {sanitizeContent(item.value)}
                        </span>
                    </li>
                );
            } else {
                return (
                    <li key={index}>
                        <span>{item.path}</span>
                        {sanitizeContent(item.value)}
                    </li>
                );
            }
        });

    // return <div>{renderData}</div>;
    // return dd.highlights.map((item, index) => (
    //     <div key={index}>
    //         <div>
    //         {item.path}
    //         </div> <div>{highlightsprocess(item.texts)}</div>
    //     </div>
    // ));
    return (
        <div>
            {dd.highlights.map((item, index) => (
                <HighlightsCard key={index} item={item} />
            ))}
        </div>
    );
};

export default Test;
