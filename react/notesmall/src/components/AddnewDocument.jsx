/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import { editingDocument } from "../action/document";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
const AddnewDocument = () => {
    const dispatch = useDispatch();
    let history = useNavigate();
    const add = async() => {
        // dispatch({
        //     type: "CREATE_DOCUMENTS",
        //     payload: {
        //         gqlMethod: "mutation",
        //         api: "createDocument",
        //         format: `(document: {title: "new document",content: "new document"})`,
        //         response: "_id title content updated_at tags{_id,name,colorCode} ",
        //     },
        // });
        
        // dispatch({
        //     type: "NEW_SIDE_BAR_LIST",
        //     payload: {
        //         _id: id,
        //         title: "new document",
        //         updated_at: new Date().toISOString(),
        //     },
        // });

        // history(`/${id}`);


        const query = `
            mutation{
            createDocument(document: {title: "new document",content: "new document"}) {
                    _id
                    content
                    title
                    updated_at 
                    tags{_id,name,colorCode}
                }}
                `;
        const eded=await fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        })
        const res = await eded.json()
        console.log("frf", res);
        
        const id = res.data.createDocument._id;
        dispatch({
            type: "CREATE_DOCUMENT_RESULT",
            payload: res.data.createDocument,
        });
        dispatch({
            type: "NEW_SIDE_BAR_LIST",
            payload: {
                _id: id,
                title: "new document",
                updated_at: new Date().toISOString(),
            },
        });
        history(`/${id}`);
            // .then((res) => res.json())
            // .then((res) => {
            //     console.log("res",res);
            //     const id = res.data.createDocument._id;
            //     dispatch({
            //         type: "CREATE_DOCUMENT_RESULT",
            //         payload: res.data.createDocument,
            //     });

            //     return id;
            // })
            // .then((id) => {
            //     dispatch({
            //         type: "NEW_SIDE_BAR_LIST",
            //         payload: {
            //             _id: id,
            //             title: "new document",
            //             updated_at: new Date().toISOString(),
            //         },
            //     });
            //     return id;
            // })
            // .then((id) => {
            //     history(`/${id}`);
            // });
    };
    
    return (
        <Button
            variant="text"
            size="small"
            onClick={()=>(add(useSelector))}
            startIcon={<AddIcon />}
            css={css`
                color: white !important;
                &:hover {
                    color: black !important;
                    background-color: #c5c5c5;
                }
            `}
        >
            New
        </Button>
    );
};

export default AddnewDocument;
