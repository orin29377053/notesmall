import Search from "./components/Search";
// import TagEditor from "./components/TagEditor";
import Taglist from "./components/tag/Taglist";
// import ProjectEditor from "./components/project/ProjectEditor";
import ProjectList from "./components/project/ProjectList";
import SmallEditor from "./components/SmallEditor";
import Home from "./components/layout/Home";

const routes = [

    {
        path: "/tag",
        component: <Taglist />,
    },
    {
        path: "/search",
        component: <Search />,
    },
    {
        path: "/project",
        component: <ProjectList />,
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
