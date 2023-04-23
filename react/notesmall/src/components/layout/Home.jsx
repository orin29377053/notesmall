/** @jsxImportSource @emotion/react */
import Calendar from "react-github-contribution-calendar";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import ActivityCalendar, { ThemeInput } from "react-activity-calendar";
const qq = (value) => {};

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
    const [myArray, setMyArray] = useState({
        "2016-06-23": 1,
        "2016-06-26": 2,
        "2016-06-27": 3,
        "2016-06-28": 4,
        "2016-06-29": 4,
    });
    const [activityCalendar, setActivityCalendar] = useState([]);

    // console.log(user);
    const panelAttributes = {
        rx: 10,
        ry: 10,
        height: 12,
        width: 12,
        margin: 11,
    };
    const explicitTheme= {
        light: ['#f0f0f0', '#c4edde', '#7ac7c4', '#f73859', '#384259'],
        dark: ['#383838', '#4D455D', '#7DB9B6', '#F5E9CF', '#E96479'],
      }; 
      
      const minimalTheme = {
        light: ['hsl(0, 0%, 92%)', 'cornflowerblue'],
        // dark: the default theme will be used as fallback
      }

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

            setMyArray(values);
        }
    }, [user]);

    const until = Date.now();
    const panelColors = ["#EEEEEE", "#F78A23", "#F87D09", "#AC5808", "#7B3F06"];

    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                margin: 20px;
            `}
        >
            <div
                css={css`
                    display: flex;
                    flex-direction: row;
                `}
            >
                <Avatar
                    alt="Orin"
                    src="https://orinlin.s3.us-east-1.amazonaws.com/1678244338311-448458.jpeg"
                    sx={{ width: 200, height: 200 }}
                    css={css`
                        margin-right: 30px;
                    `}
                />
                <div
                    css={css`
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;
                    `}
                >
                    <div
                        css={css`
                            font-size: 30px;
                            font-weight: bold;
                            margin-left: 15px;
                        `}
                    >
                        Notes contribution
                    </div>
                    {/* <Calendar
                        values={myArray}
                        until={until}
                        panelColors={panelColors}
                        panelAttributes={panelAttributes}
                    /> */}
            <ActivityCalendar data={activityCalendar } colorScheme={"light"} theme={minimalTheme} />
                </div>
            </div>
            Home2{process.env.REACT_APP_TEST}
        </div>
    );
};

export default Home;
