import React from "react";
import "../App.css";
import Getlist from "./Getlist";
import AddnewDocument from "./AddnewDocument";
const Sidebar = () => {
    return (
        <div className="sidebar">
            <AddnewDocument/>
            <Getlist />
        </div>
    );
};

export default Sidebar;
