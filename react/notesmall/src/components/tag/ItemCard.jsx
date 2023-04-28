/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";

const ItemCard = ({ item }) => {
    console.log("wsws", item);
    return item?.map((doc) => (
        <div
            css={css`
                padding: 10px;
                margin-top: 10px;
            `}
        >
            <DocumentCard
                title={doc.title}
                content={sanitizeContent(doc.content)}
                _id={doc._id}
                image={extractImageURL(doc.content)}
            />
        </div>
    ));
};

export default ItemCard;
