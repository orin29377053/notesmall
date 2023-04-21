import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "../Sidebar";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <Container fluid className="p-0">
            <Header />
            <Row className="m-0">
                <Sidebar />
                <div className="main-content">
                    {children}
                    {/* <Footer /> */}
                </div>
            </Row>
        </Container>
    );
};

export default Layout;
