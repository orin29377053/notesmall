import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { useSelector, useDispatch } from "react-redux";
import { editingDocument } from "../action/document";

const ReadMarkdown = ({ setHtmlContent, setId, id }) => {
    const dispatch = useDispatch();
    
    console.log(id);


    useEffect(() => {
        let query;
        if (id) {
            console.log("id", id)
            query = `
        query{
            document( id: "642ea92c3e72b7404188793b") {
                _id
                title
                content
            }
        }
        `;
        fetch("http://localhost:8000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                console.log("i am good")

                // console.log("ddddd",res.data.documents[0]);
                const documnet = marked(res.data.document.content);
                setId(res.data.document._id);
                console.log("aaaaa", res.data.document._id);
                setHtmlContent(documnet);
                dispatch(editingDocument(res.data.document));
            });
        } else {
            console.log("i am bad")

            query = `
            query{
                documents {
                    _id
                    title
                    content
                }
            }
            `;
            fetch("http://localhost:8000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            })
                .then((res) => res.json())
                .then((res) => {
                    // console.log("ddddd",res.data.documents[0]);
                    const documnet = marked(res.data.documents[0].content);
                    setId(res.data.documents[0]._id);
                    console.log("aaaaa", res.data.documents[0]._id);
                    setHtmlContent(documnet);
                    dispatch(editingDocument(res.data.documents[0]));
                });
        }
        // fetch("http://localhost:8000/marked")
        //     .then((res) => res.json())
        //     .then((res) => {
        //         console.log(res.data);
        //         setHtmlContent(res.data);

        //     });


    }, [id]);

    return;
};

export default ReadMarkdown;
