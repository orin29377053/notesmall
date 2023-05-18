import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useSelector } from "react-redux";

const TOC = ({ tracingDoc, pathID, reducerID }) => {
    const { editingDocument } = useSelector((state) => state.editor);
    const [headings, setHeadings] = useState([]);
    const content = editingDocument?.content;


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
    }, [tracingDoc, pathID, reducerID,content]);

    

    return (
        <nav
            css={css`
                font-size: 1rem;
                display: flex;
                flex-direction: column;
            `}
        >
            <ul
                css={css`
                    padding-left: 1px;
                `}
            >
                {headings.map((heading, index) => (
                    <li
                        className="singleLine"
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
                                padding: 3px 1px;

                                border-radius: 5px;
                                &:hover {
                                    background-color: #ecf1fe;
                                    color: #1976d2;
                                    font-weight: 600 !important;
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
