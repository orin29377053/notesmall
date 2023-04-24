/** @jsxImportSource @emotion/react */
import Calendar from "react-github-contribution-calendar";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import ActivityCalendar, { ThemeInput } from "react-activity-calendar";
import DocumentCard from "../common/Card";
import sanitizeContent from "../../utils/sanitizeContent";
import extractImageURL from "../../utils/extractImageURL";
import { getFormattedTime } from "../../utils/timehandling";
import { Row, Col } from "react-bootstrap";

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

const ItemCard = ({ item }) => {
    return item?.map((doc) => (
        <div
            css={css`
                padding: 10px;
                margin-top: 10px;
                display: flex;
            `}
        >
            {console.log(doc)}
            <DocumentCard
                title={doc?.title}
                content={sanitizeContent(doc?.content)}
                _id={doc?._id}
                image={extractImageURL(doc?.content)}
            />
        </div>
    ));
};

const Home = () => {
    const { user } = useSelector((state) => state.user);
    const { sidebar } = useSelector((state) => state.common);

    const [activityCalendar, setActivityCalendar] = useState([]);
    const [recentItem, setRecentItem] = useState([]);
    const [favoriteItem, setFavoriteItem] = useState([]);

    // console.log(user);

    const minimalTheme = {
        light: ["hsl(0, 0%, 92%)", "cornflowerblue"],
        // dark: the default theme will be used as fallback
    };

    useEffect(() => {
        if (user && user.documents) {
            const values = user?.documents.reduce((acc, curr) => {
                const date = curr.created_at.slice(0, 10); // extract the date from the timestamp
                acc[date] = (acc[date] || 0) + 1; // increment the count for that date
                return acc;
            }, {});
            const activityCalendar = buildActivityCalendar(user.documents);
            console.log(activityCalendar, "activityCalendar");
            setActivityCalendar(activityCalendar);
        }
    }, [user]);

    useEffect(() => {
        if (sidebar.length === 0) {
            return;
        }
        const deletedItems = sidebar?.filter((item) => item.isDeleted);
        const archivedItems = sidebar?.filter(
            (item) => item.isArchived && !item.isDeleted
        );
        const favoriteItems = sidebar?.filter(
            (item) => item.isFavorite && !item.isArchived && !item.isDeleted
        );
        const otherItems = sidebar?.filter(
            (item) => !item.isFavorite && !item.isArchived && !item.isDeleted
        );
        const allItems = [...favoriteItems, ...otherItems];
        const compareFunction = (a, b) => {
            const aTime = new Date(a.updated_at).getTime();
            // console.log("aTime", aTime)
            const bTime = new Date(b.updated_at).getTime();
            return bTime - aTime;
        };
        const recentItems = allItems.slice().sort(compareFunction);
        setRecentItem(recentItems);
        setFavoriteItem(favoriteItems);
        console.log(recentItem, "recentItems");
    }, [sidebar]);

    return (
        <div>
            <Row
                className="d-flex my-2 p-2"
                css={css`
                    align-items: center;
                `}
            >
                <Col md={5}>
                    <Row>
                        <Col md={4}>
                            <Avatar
                                alt="Orin"
                                src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                                sx={{ width: 100, height: 100, margin: "auto" }}
                            />
                        </Col>
                        <Col md={7}>
                            <div className="docInfoBlock">
                                <div className="docInfoTitle">Email</div>
                                <div>{user?.email}</div>
                            </div>
                            <div className="docInfoBlock">
                                <div className="docInfoTitle">Name</div>
                                <div>Orin</div>
                            </div>
                            <div className="docInfoBlock">
                                <div className="docInfoTitle">Role</div>
                                <div>{user?.role}</div>
                            </div>
                            <div className="docInfoBlock">
                                <div className="docInfoTitle">Begin</div>
                                <div>
                                    {getFormattedTime(user?.created_at)?.slice(
                                        0,
                                        10
                                    ) || ""}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={3} className="text-center pe-4">
                    <Row>
                        <Col
                            className="pe-4"
                            css={css`
                                border-right: 1px solid #e0e0e0;
                            `}
                        >
                            <div className="fs-1">
                                {user?.documents?.length}
                            </div>
                            <div>
                                <small>Documents</small>
                            </div>
                        </Col>
                        <Col>
                            <div className="fs-1">{user?.projects?.length}</div>
                            <div>
                                <small>Projects</small>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <ActivityCalendar
                        data={activityCalendar}
                        colorScheme={"light"}
                        theme={minimalTheme}
                    />
                </Col>
            </Row>
            <hr />
            <Row
                className="m-0"
                css={css`
                    overflow-x: auto;
                `}
            >
                <h6>Recent</h6>
                <Col className="d-inline-flex">
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
                                content={sanitizeContent(doc?.content)}
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
                    overflow-x: auto;
                `}
            >
                <h6>Favorite</h6>
                <Col className="d-inline-flex">
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
                                    content={sanitizeContent(doc?.content)}
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
