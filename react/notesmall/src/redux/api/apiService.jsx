import axios from "axios";

export const APIKit = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 30000,
});


export const API_METHOD = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
};
