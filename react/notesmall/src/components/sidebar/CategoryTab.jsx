import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import FavoriteDocument from "./FavoriteDocument";
import MainDocument from "./MainDocument";
import ProjectDocument from "./ProjectDocument";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
const CategoryTab = () => {
    const { sidebar } = useSelector((state) => state.common);
    const { projectlist } = useSelector((state) => state.project);
    console.log("projectlist", projectlist);

    const [value, setValue] = React.useState("main");

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
        const aTime = new Date(a.update_time).getTime();
        const bTime = new Date(b.update_time).getTime();
        return aTime - bTime;
    };

    const recentItems = allItems.sort(compareFunction);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                        css={css`
                            padding: 0px 0px 0px 0px;
                        `}
                        
                    >
                        <Tab icon={<InsertDriveFileOutlinedIcon />} value="main" css={css`
                            padding: 0px 0px 0px 0px;


                        `}
                            sx={{
                                maxWidth:50,   
                                minWidth: 30,
                            }} />
                        <Tab icon={<StarBorderOutlinedIcon/>} value="favorite" css={css`
                            padding: 0px 0px 0px 0px;
                            width: 30px;

                        `}sx={{
                            maxWidth: 30,   
                            minWidth: 30,
                        }} />
                        <Tab icon={<AccountTreeOutlinedIcon/>} value="project" css={css`
                            padding: 0px 0px 0px 0px;
                            width: 30px;

                        `}sx={{
                            maxWidth: 30,   
                            minWidth: 30,
                        }}/>
                    </TabList>
                </Box>
                <TabPanel value="main" css={css`
                        padding: 0px 0px;`}>
                    <MainDocument
                        deletedItems={deletedItems}
                        archivedItems={archivedItems}
                        otherItems={otherItems}
                        allItems={allItems}
                        recentItems={recentItems}
                    />
                </TabPanel>
                <TabPanel value="favorite" css={css`
                        padding: 0px 0px;`}>
                    <FavoriteDocument list={favoriteItems} />
                </TabPanel>
                <TabPanel value="project" css={css`
                        padding: 0px 0px;`}>
                    <ProjectDocument projectlist={projectlist} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default CategoryTab;
