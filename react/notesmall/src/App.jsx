// import SmallEditor from "./components/SmallEditor";
// import Sidebar from "./components/Sidebar";
import CommonProvider from "./components/CommonProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes ,Navigate} from "react-router-dom";
// import Search from "./components/Search";
// import TagEditor from "./components/TagEditor";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import ProjectEditor from "./components/project/ProjectEditor";
// import Header from "./components/layout/Header";
// import Login from "./components/user/Login";
import routes from "./routes";
import Layout from "./components/layout/Layout";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <CommonProvider>
                    {/* <div className="body">
                        <Header />
                        <Sidebar />
                        <div className="content">
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/tag" element={<TagEditor />} />
                                <Route path="/search/" element={<Search />} />
                                <Route
                                    path="/project"
                                    element={<ProjectEditor />}
                                />
                                <Route path="/:id" element={<SmallEditor />} />
                            </Routes>
                        </div>
                    </div> */}
                    <Layout>
                        <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={route.component}
                                />
                            ))}
                        </Routes>
                    </Layout>
                </CommonProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
