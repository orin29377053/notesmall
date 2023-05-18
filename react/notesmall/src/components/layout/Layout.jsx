import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "../Sidebar";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="py-0 px-2 d-flex container-xxl">
                <Sidebar />
                <div className="main-content">
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
