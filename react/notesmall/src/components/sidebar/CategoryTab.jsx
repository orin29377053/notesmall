import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import FavoriteDocument from "./FavoriteDocument";
import MainDocument from "./MainDocument";

const CategoryTab = () => {
    const { sidebar } = useSelector((state) => state.common);

    const [value, setValue] = React.useState("1");

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
    const allItems = [...favoriteItems, ...otherItems]
    const compareFunction = (a, b) => {
        const aTime = new Date(a.update_time).getTime();
        const bTime = new Date(b.update_time).getTime();
        return aTime - bTime;
      };
      
      // 使用 Array.sort() 方法進行排序
    
    
    const recentItems=allItems.sort(compareFunction);

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
                    >
                        <Tab label="main" value="main" />
                        <Tab label="favorite" value="favorite" />
                        <Tab label="project" value="project" />
                    </TabList>
                </Box>
                <TabPanel value="main">
                    <MainDocument
                        deletedItems={deletedItems}
                        archivedItems={archivedItems}
                        otherItems={otherItems}
                        allItems={allItems}
                        recentItems={recentItems}
                    />
                </TabPanel>
                <TabPanel value="favorite">
                    <FavoriteDocument list={favoriteItems} />
                </TabPanel>
                <TabPanel value="project">Item Three</TabPanel>
            </TabContext>
        </Box>
    );
};

export default CategoryTab;
