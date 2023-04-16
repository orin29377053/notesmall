import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";
import { getProjectList } from "./project";

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
function* fetchUpdateProject(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_DOCUMENT_PROJECT",
        queryString: action.payload,
    });
    console.log("update project");
    const action2 = {
        type: "FETCH_Project_LIST",
        payload: {
            gqlMethod: "query",
            api: "projects",
            response: "_id name  documents {_id title content updated_at}",
        },
    };
    yield* getProjectList(action2);
}

function* mySaga() {
    yield takeLatest("EDIT_TITLE", fetch);
    yield takeLatest("UPDATE_TAGS", fetchUpdateTags);
    yield takeLatest("QUERY_DOCUMENTS", fetchQueryDocument);
    yield takeLatest("CREATE_DOCUMENTS", fetchCreateDocument);
    yield takeLatest("UPDATE_PROJECT", fetchUpdateProject);
}

export default mySaga;
