import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import TocIcon from "@mui/icons-material/Toc";
const TOC = ({ tracingDoc, pathID, reducerID }) => {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const headingElements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6"
        );

        const headingsArray = Array.from(headingElements).map((heading) => {
            return {
                text: heading.textContent,
                level: parseInt(heading.tagName.substring(1)),
            };
        });

        setHeadings(headingsArray);
    }, [tracingDoc, pathID, reducerID]);

    return (
        <nav>
            <div
                css={css`
                    margin-bottom: 5px;
                    font-size: 14px;
                `}
            >
                <TocIcon
                    css={css`
                        color: #1976d2;
                        margin-right: 5px;
                    `}
                />
                Content
            </div>
            <ul
                css={css`
                    padding-left: 10px;
                `}
            >
                {headings.map((heading, index) => (
                    <li
                        key={index}
                        css={css`
                            list-style: none;
                        `}
                    >
                        <a
                            href={`#:~:text=${heading.text}`}
                            css={css`
                                text-decoration: none;
                                color: black;
                                font-size: 0.8rem;
                                width: 100%;
                                padding: 5px 10px;
                                border-radius: 5px;
                                &:hover {
                                    background-color: #ecf1fe;
                                    color: #1976d2;
                                    font-weight: 700 !important;
                                }
                            `}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TOC;
