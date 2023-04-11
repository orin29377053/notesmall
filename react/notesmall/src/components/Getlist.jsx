/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../App.css";

function Getlist() {
    const { sidebar } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const getlist = () => {
        dispatch({
            type: "FETCH_SIDEBAR_LIST",
            payload: {
                gqlMethod: "query",
                api: "documents",
                format: "(isDeleted: false)",
                response: "_id title updated_at",
            },
        });
    };
    useEffect(() => {
        getlist();
    }, []);

    const goToDoc = (id) => {
        dispatch({
            type: "CHANGE_DOCUMENT",
            payload: { id },
        });
    };

    return (
        <div>
            <div className="my-3 text-center"></div>
            {sidebar?.map((item) => (
                <div
                    key={item._id}
                    onClick={() => goToDoc(item._id)}
                    css={css`
                        text-decoration: none;
                        color: #dedede;

                        &:hover {
                            color: black;
                        }
                    `}
                >
                    <div
                        css={css`
                            border-bottom: 1px solid #494949;
                            padding: 8px 20px;
                            &:hover {
                                background-color: #c5c5c5;
                                color: #474747;
                            }
                        `}
                    >
                        <div
                            css={css`
                                font-weight: bold;
                                font-size: 1.2rem;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            `}
                        >
                            {item.title}
                        </div>
                        <div
                            css={css`
                                font-size: small;
                            `}
                        >
                            {item.updated_at?.slice(0, 19).replace("T", " ")}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Getlist;
