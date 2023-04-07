import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { editingDocument } from "../action/document";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const AddnewDocument = () => {
    const dispatch = useDispatch();

    let history = useNavigate();
    const add = () => {
        const query = `
            mutation{
            createDocument(document: {title: "new document",content: "new document"}) {
                    _id
                    content
                    title
                }}
                `;
        fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                const id = res.data.createDocument._id;
                dispatch(editingDocument(res.data.createDocument));

                return id;
            })
            .then((id) => {
                history(`/${id}`);
            });
    };

    return (
        <Button variant="contained" size="small" onClick={add}>
            ADD
        </Button>
    );
};

export default AddnewDocument;
