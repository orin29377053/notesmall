import logo from "./logo.svg";
import "./App.css";
import SmallEditor from "./components/SmallEditor";
import Sidebar from "./components/Sidebar";
import CommonProvider from "./components/CommonProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./components/Search";
import TagEditor from "./components/TagEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ProjectEditor from "./components/ProjectEditor";

const Initail = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: "FETCH_TAG_LIST",
            payload: {
                gqlMethod: "query",
                api: "tags",
                response: "_id name colorCode document{_id title content}",
            },
        });
    }, []);
};

function App() {
    return (
        <Provider store={store}>
            {/* <Initail/> */}
            <BrowserRouter>
                <CommonProvider>
                    <div className="body">
                        <Sidebar />
                        <div className="content">
                            <Routes>
                                <Route path="/tag" element={<TagEditor />} />
                                <Route path="/search/" element={<Search />} />
                                <Route path="/project" element={<ProjectEditor />} />
                                <Route path="/:id" element={<SmallEditor />} />
                            </Routes>
                        </div>
                    </div>
                </CommonProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
