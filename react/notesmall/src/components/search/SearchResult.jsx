/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import SearchDetails from "./SearchDetails";
import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import markdownHandler from "../../utils/markdownHandler";
import { Row, Col } from "react-bootstrap";
function removeLinkInBrackets(text) {
    const pattern = /\[(.*?)\]\((.*?)\)/g;
    return text.replace(pattern, "$1");
}

const SearchResult = ({ searchResult }) => (
    <>
        <div
            css={css`
                margin-top: 10px;
                color: #1976d2;
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 10px;
            `}
        >
            {searchResult.length > 1 ? "There are" : "There is"} found{" "}
            {searchResult.length} relevant{" "}
            {searchResult.length > 1 ? "documents" : "document"}
        </div>
        {searchResult?.map((item, i) => (
            <div key={item._id}>
                <Row
                    css={css`
                        align-items: stretch;
                        padding: 10px;
                    `}
                >
                    <Col
                        md={8}
                        css={css`
                            overflow: auto;
                            padding: 10px;
                            border-radius: 5px;
                            border: 1px solid #e0e0e0;
                            max-height: 285px;
                        `}
                    >
                        <SearchDetails highlights={item.highlights} />
                    </Col>
                    <Col md={4}>
                        <DocumentCard
                            title={item.title}
                            content={markdownHandler(item.content)}
                            _id={item._id}
                            image={extractImageURL(item.content)}
                        />
                    </Col>
                </Row>
            </div>
        ))}
    </>
);

export default SearchResult;
