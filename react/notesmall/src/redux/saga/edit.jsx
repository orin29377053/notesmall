import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetch(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_DOCUMENT_TITLE",
        queryString: action.payload,
    });
}

function* fetchUpdateTags(action) {
    console.log(action);
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_TAGS_RESULT",
        queryString: action.payload,
    });
}

function* fetchQueryDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "EDITING_DOCUMENT",
        queryString: action.payload,
    });
}
function* fetchCreateDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "CREATE_DOCUMENT_RESULT",
        queryString: action.payload,
    });
}

function* mySaga() {
    yield takeLatest("EDIT_TITLE", fetch);
    yield takeLatest("UPDATE_TAGS", fetchUpdateTags);
    yield takeLatest("QUERY_DOCUMENTS", fetchQueryDocument);
    yield takeLatest("CREATE_DOCUMENTS", fetchCreateDocument);
}

export default mySaga;
