/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import SearchDetails from "./SearchDetails";
import DocumentCard from "../Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { Row, Col } from "react-bootstrap";
function removeLinkInBrackets(text) {
    const pattern = /\[(.*?)\]\((.*?)\)/g;
    return text.replace(pattern, "$1");
}

const SearchResult = ({ searchResult }) => (
    <>
        {searchResult?.map((item, i) => (
            <div key={item._id}>
                <Row
                    css={css`
                        height: 300px;
                        align-items: center;
                    `}
                >
                    <Col
                        md={8}
                        css={css`
                            height: 280px;
                            overflow: auto;
                            padding: 10px;
                            border-radius: 5px;
                        `}
                    >
                        <SearchDetails highlights={item.highlights} />
                    </Col>
                    <Col md={4}>
                        <DocumentCard
                            title={item.title}
                            content={sanitizeContent(removeLinkInBrackets(item.content))}
                            _id={item._id}
                            image={extractImageURL(item.content)}
                        />
                    </Col>
                </Row>
                {searchResult.length - 1 !== i && <hr />}
            </div>
        ))}
    </>
);

export default SearchResult;
