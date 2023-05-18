/** @jsxImportSource @emotion/react */
import Calendar from "react-github-contribution-calendar";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import ActivityCalendar, { ThemeInput } from "react-activity-calendar";
import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { getFormattedTime } from "../../utils/timehandling";
import { Row, Col } from "react-bootstrap";
import guset from "../../image/guestIMG.png";
import markdownHandler from "../../utils/markdownHandler";
import { set } from "lodash";

function buildActivityCalendar(documents) {
    const dateCounts = {};

    // Count the documents created for each date
    documents.forEach((document) => {
        const date = new Date(document.created_at).toISOString().split("T")[0];

        if (!dateCounts[date]) {
            dateCounts[date] = 0;
        }

        dateCounts[date]++;
    });

    // Calculate the levels based on counts and create the final result
    const activityCalendar = Object.entries(dateCounts).map(([date, count]) => {
        let level;

        if (count <= 0) {
            level = 0;
        } else if (count <= 8) {
            level = 1;
        } else if (count <= 12) {
            level = 2;
        } else if (count <= 16) {
            level = 3;
        } else {
            level = 4;
        }

        return { date, count, level };
    });

    return activityCalendar;
}


const Home = () => {
    const { user } = useSelector((state) => state.user);
    const { sidebar } = useSelector((state) => state.common);

    const [activityCalendar, setActivityCalendar] = useState([]);
    const [recentItem, setRecentItem] = useState([]);
    const [favoriteItem, setFavoriteItem] = useState([]);
    const [allitems, setAllItems] = useState([]);

    const dispatch = useDispatch();
    const getUser = (dispatch) => {
        dispatch({
            type: "FETCH_USER_INFO",
            payload: {
                gqlMethod: "query",
                api: "me",
                response: `_id 
                    email 
                    token 
                    role
                    created_at
                    documents{
                        _id title updated_at isDeleted isFavorite isArchived created_at content
                    }
                    projects{
                        _id name  documents {
                            _id title content updated_at isDeleted
                        }
                    }
                    tags{
                        _id name colorCode
                    }
                    `,
            },
        });
    };

    const minimalTheme = {
        light: ["hsl(0, 0%, 92%)", "cornflowerblue"],
        // dark: the default theme will be used as fallback
    };

    useEffect(() => {
        if (user && user.documents) {
            const activityCalendar = buildActivityCalendar(user.documents);
            setActivityCalendar(activityCalendar);
        }
    }, [user]);

    useEffect(() => {
       
        
        const favoriteItems = sidebar?.filter(
            (item) => item.isFavorite && !item.isArchived && !item.isDeleted
        );
        
        const allItems = sidebar?.filter(
            (item) => !item.isArchived && !item.isDeleted
        );
        const compareFunction = (a, b) => {
            const aTime = new Date(a.updated_at).getTime();
            const bTime = new Date(b.updated_at).getTime();
            return bTime - aTime;
        };

        
        setAllItems(allItems);
        const recentItems = allItems.slice().sort(compareFunction);
        setRecentItem(recentItems);
        setFavoriteItem(favoriteItems);
    }, [sidebar]);

    useEffect(() => {
        getUser(dispatch);
    }, []);

    return (
        <div className="p-2">
            <Row
                className="d-flex m-0 my-2 p-2"
                css={css`
                    align-items: center;
                `}
            >
                <Col md={3} className="text-center">
                    <Avatar
                        alt="Orin"
                        src={user.role=='guest'?guset:"https://image.notesmall.site/resized-mypic.jpeg"}
                        sx={{ width: 150, height: 150, margin: "auto" }}
                    />
                    <div
                        className="mt-2"
                        css={css`
                            color: #877f7f;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        `}
                    >
                        {user?.email}
                    </div>
                </Col>

                <Col md={5}>
                    <ActivityCalendar
                        data={activityCalendar}
                        colorScheme={"light"}
                        theme={minimalTheme}
                        blockSize={12}
                        blockMargin={5}
                    />
                </Col>
                <Col md={4} className="text-center px-2">
                    <Row>
                        <Col
                            className="pe-2 pb-2"
                            css={css`
                                border-right: 1px solid #e0e0e0;
                            `}
                        >
                            <div className="fs-2">
                                {allitems.length}
                            </div>
                            <div>
                                <small>Documents</small>
                            </div>
                        </Col>
                        <Col
                            className="pe-2"
                            css={css`
                                border-right: 1px solid #e0e0e0;
                            `}
                        >
                            <div className="fs-2">{user?.projects?.length}</div>
                            <div>
                                <small>Projects</small>
                            </div>
                        </Col>
                        <Col>
                            <div className="fs-2">{user?.tags?.length}</div>
                            <div>
                                <small>Tags</small>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row
                className="m-0"
                css={css`
                    max-width: fit-content;
                    overflow: auto;
                `}
            >
                <h4
                    
                >
                Recent
                </h4>
                <Col className="d-inline-flex mt-2">
                    {recentItem?.map((doc) => (
                        <div
                            key={doc?._id}
                            className="mb-2 d-block me-3"
                            css={css`
                                min-width: 300px !important;
                                width: 300px !important;
                            `}
                        >
                            <DocumentCard
                                title={doc?.title}
                                content={markdownHandler(doc?.content)}
                                _id={doc?._id}
                                image={extractImageURL(doc?.content)}
                            />
                        </div>
                    ))}
                </Col>
            </Row>
            <hr />
            <Row
                className="m-0"
                css={css`
                    max-width: fit-content;
                    overflow: auto;
                `}
            >
                <h4
                    
                >
                   Favorite
                </h4>
                <Col className="d-inline-flex mt-2">
                    {favoriteItem?.length === 0 ? (
                        <div className="fst-italic mx-3 mb-4">-None-</div>
                    ) : (
                        favoriteItem?.map((doc) => (
                            <div
                                key={doc?._id}
                                className="mb-2 d-block me-3"
                                css={css`
                                    min-width: 300px !important;
                                    width: 300px !important;
                                `}
                            >
                                <DocumentCard
                                    title={doc?.title}
                                    content={markdownHandler(doc?.content)}
                                    _id={doc?._id}
                                    image={extractImageURL(doc?.content)}
                                />
                            </div>
                        ))
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Home;
