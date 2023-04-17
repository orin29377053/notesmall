import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";
import { getProjectList } from "./project";

function* fetch(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
    });
}
function* deleteDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "DELETE_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
    });
    const action2 = {
        type: "FETCH_Project_LIST",
        payload: {
            gqlMethod: "query",
            api: "projects",
            response: "_id name  documents {_id title content updated_at isDeleted}",
        },
    };
    yield* getProjectList(action2);
}
function* searchDocuments(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "SEARCH_LIST_RESULT",
        queryString: action.payload,
    });
}

function* fetchPermentDeleteDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "PERMENT_DELETE_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
    });
}


function* mySaga() {
    yield takeLatest("FETCH_SIDEBAR_LIST", fetch);
    yield takeLatest("DELETE_SIDEBAR_LIST", deleteDocument);
    yield takeLatest("SEARCH_LIST", searchDocuments);
    yield takeLatest("PERMENT_DELETE_DOCUMENT", fetchPermentDeleteDocument);

}

export default mySaga;
