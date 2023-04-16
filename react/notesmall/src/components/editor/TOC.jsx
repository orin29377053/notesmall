import React, { useState, useEffect } from "react";

const TOC = ({tracingDoc}) => {
    const [headings, setHeadings] = useState([]);
    

    useEffect(() => {
        // 獲取所有標題元素
        const headingElements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6"
        );

        // 將標題元素轉換成一個包含標題文本和標題級別的對象
        const headingsArray = Array.from(headingElements).map((heading) => {
            return {
                text: heading.textContent,
                level: parseInt(heading.tagName.substring(1)),
            };
        });

        setHeadings(headingsArray);
    }, [tracingDoc]);

    return (
        <nav>
            <ul>
                {headings.map((heading, index) => (
                    <li key={index}>
                        <a href={`#:~:text=${heading.text}`}>{heading.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TOC;
