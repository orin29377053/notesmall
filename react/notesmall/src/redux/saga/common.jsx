import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetch(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
    });
}
function* deleteDocument(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "DELETE_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
    });
}
function* searchDocuments(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "SEARCH_LIST_RESULT",
        queryString: action.payload,
    });
}
function* mySaga() {
    yield takeLatest("FETCH_SIDEBAR_LIST", fetch);
    yield takeLatest("DELETE_SIDEBAR_LIST", deleteDocument);
    yield takeLatest("SEARCH_LIST", searchDocuments);

}

export default mySaga;
