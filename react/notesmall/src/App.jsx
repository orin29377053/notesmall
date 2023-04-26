
import CommonProvider from "./components/CommonProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes ,Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import routes from "./routes";
import Layout from "./components/layout/Layout";
import AlertInformation from "./components/common/AlertInformation";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <CommonProvider>
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
                        <AlertInformation />
                    </Layout>
                </CommonProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
