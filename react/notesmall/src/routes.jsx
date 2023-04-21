import Search from "./components/Search";
import TagEditor from "./components/TagEditor";
import ProjectEditor from "./components/project/ProjectEditor";
import SmallEditor from "./components/SmallEditor";
import Home from "./components/layout/Home";

const routes = [

    {
        path: "/tag",
        component: <TagEditor />,
    },
    {
        path: "/search",
        component: <Search />,
    },
    {
        path: "/project",
        component: <ProjectEditor />,
    },
    {
        path: "/:id",
        component: <SmallEditor />,
    },
    {
        path: "/home",
        component: <Home />,
    },
    

];

export default routes;
