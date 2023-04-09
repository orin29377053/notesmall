import logo from "./logo.svg";
import "./App.css";
import SmallEditor from "./components/SmallEditor";
import Sidebar from "./components/Sidebar";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./components/Search";
import TagEditor from "./components/TagEditor";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="body">
                    <Sidebar />
                    <div className="content">
                        <Routes>
                            <Route path="/tag" element={<TagEditor />} />
                            <Route path="/search/" element={<Search />} />
                            <Route path="/:id" element={<SmallEditor />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
