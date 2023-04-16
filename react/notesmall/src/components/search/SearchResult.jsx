/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import SearchDetails from "./SearchDetails";
import DocumentCard from "../Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { Row, Col } from "react-bootstrap";

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
                    <Col md={4}>
                        <DocumentCard
                            title={item.title}
                            content={sanitizeContent(item.content)}
                            _id={item._id}
                            image={extractImageURL(item.content)}
                        />
                    </Col>
                    <Col
                        md={8}
                        css={css`
                            height: 280px;
                            overflow: auto;
                            border: 1px solid #d8d8d8;
                            padding: 5px;
                            border-radius: 5px;
                        `}
                    >
                        <SearchDetails highlights={item.highlights} />
                    </Col>
                </Row>
                {searchResult.length - 1 !== i && <hr />}
            </div>
        ))}
    </>
);

export default SearchResult;
