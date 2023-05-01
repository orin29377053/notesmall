import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";
import { getProjectList } from "./project";

function* fetch(action) {
    const token = localStorage.getItem("token");
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
        error: "Delete Document Error",
        success: "Delete Document Success, You can restore it in 30 days",
    });
    const action2 = {
        type: "FETCH_Project_LIST",
        payload: {
            gqlMethod: "query",
            api: "projects",
            response:
                "_id name  documents {_id title content updated_at isDeleted}",
        },
    };
    yield* getProjectList(action2);
}

function* restoreDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "RESTORE_SIDEBAR_LIST_RESULT",
        queryString: action.payload,
        error: "Restore Document Error",
        success: "Restore Document Success",
    });
    const action2 = {
        type: "FETCH_Project_LIST",
        payload: {
            gqlMethod: "query",
            api: "projects",
            response:
                "_id name  documents {_id title content updated_at isDeleted}",
        },
    };
    yield* getProjectList(action2);
    yield put({
        type: "RESTORE_DOCUMENT",
    });
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
        error: "Perment Delete Document Error",
        success: "Perment Delete Document Success",
    });
}

function* mySaga() {
    yield takeLatest("FETCH_SIDEBAR_LIST", fetch);
    yield takeLatest("DELETE_SIDEBAR_LIST", deleteDocument);
    yield takeLatest("SEARCH_LIST", searchDocuments);
    yield takeLatest("PERMENT_DELETE_DOCUMENT", fetchPermentDeleteDocument);
    yield takeLatest("RESTORE_SIDEBAR_LIST", restoreDocument);
}

export default mySaga;
