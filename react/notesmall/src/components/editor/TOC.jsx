import React, { useState, useEffect } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


const TOC = ({tracingDoc,pathID,reducerID}) => {
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
    }, [tracingDoc,pathID,reducerID]);

    return (
        <nav>
            <div css={css`
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
                        
                        `}>Content</div>
            <ul css={css`
            padding-left: 10px;
            `}>
                {headings.map((heading, index) => (
                    <li key={index} css={
                        css`
                        list-style: none;

                        
                        `
                    }>
                        <a href={`#:~:text=${heading.text}`} css={css`
                        text-decoration: none; 
                        color: black;
                        font-size: 0.8rem;
                        :hover{
                            color: #3f51b5;
                            text-decoration: underline;
                            font-size: 0.9rem;
                        }
                    
                        `}>{heading.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TOC;
