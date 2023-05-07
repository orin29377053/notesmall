import { takeLatest, put ,takeEvery} from "redux-saga/effects";
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

function* fetchUpdateTags(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_TAGS_RESULT",
        queryString: action.payload,
        error: "Update Tag Error",
        success: "Update Tag Success",
    });
}

function* fetchQueryDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "EDITING_DOCUMENT",
        queryString: action.payload,
        helper: action.payload.helper,
        error: "Loading Document Error, Please Try Again or Check Your Internet Connection",

    });
}
function* fetchCreateDocument(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "CREATE_DOCUMENT_RESULT",
        queryString: action.payload,
        helper: action.helper,
    });
}
function* fetchUpdateProject(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_DOCUMENT_PROJECT",
        queryString: action.payload,
        error: "Update Project Error",
        success: "Update Project Success",
    });
    const action2 = {
        type: "FETCH_Project_LIST",
        payload: {
            gqlMethod: "query",
            api: "projects",
            response: "_id name  documents {_id title content updated_at isDeleted} ",
        },
    };
    yield* getProjectList(action2);
}


function* mySaga() {
    yield takeLatest("EDIT_TITLE", fetch);
    yield takeEvery("UPDATE_TAGS", fetchUpdateTags);
    yield takeLatest("QUERY_DOCUMENTS", fetchQueryDocument);
    yield takeEvery("CREATE_DOCUMENTS", fetchCreateDocument);
    yield takeEvery("UPDATE_PROJECT", fetchUpdateProject);

}

export default mySaga;
