import React,{useState} from "react";
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
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
const CategoryTab = () => {
    const { sidebar } = useSelector((state) => state.common);
    const { projectlist } = useSelector((state) => state.project);

    const [value, setValue] = useState("main");

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }} className="p-1">
            <TabContext value={value}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <TabList
                        onChange={handleChange}
                        variant="fullWidth"
                    >
                        <Tab
                            icon={<InsertDriveFileOutlinedIcon />}
                            value="main"
                            sx={{ padding:0 }}
                        />
                        <Tab
                            icon={<StarBorderOutlinedIcon />}
                            value="favorite"
                            sx={{ padding:0}}

                        />
                        <Tab
                            icon={<AccountTreeOutlinedIcon />}
                            value="project"
                            sx={{ padding:0}}

                        />
                    </TabList>
                </Box>
                <TabPanel
                    value="main"
                    css={css`
                        padding: 0px 0px;
                    `}
                >
                    <MainDocument
                        deletedItems={deletedItems}
                        archivedItems={archivedItems}
                        otherItems={otherItems}
                        allItems={allItems}
                        recentItems={recentItems}
                    />
                </TabPanel>
                <TabPanel
                    value="favorite"
                    css={css`
                        padding: 0px 0px;
                    `}
                >
                    <FavoriteDocument list={favoriteItems} />
                </TabPanel>
                <TabPanel
                    value="project"
                    css={css`
                        padding: 0px 0px;
                    `}
                >
                    <ProjectDocument projectlist={projectlist} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default CategoryTab;
