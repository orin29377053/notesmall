import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

export function* getProjectList(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "Project_LIST_RESULT",
        queryString: action.payload,
    });
}

function* createNewProject(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "CREATE_PROJECT_RESULT",
        queryString: action.payload,
    });
    yield* someOtherGenerator();
}
function* someOtherGenerator() {
    console.log("data~~~");
}
function* deleteProject(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "DELETE_PROJECT_RESULT",
        queryString: action.payload,
    });
}
function* updateProject(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_PROJECT_RESULT",
        queryString: action.payload,
        error: "Update Project Error",
        success: "Update Project Success",
    });
}




function* mySaga() {
    yield takeLatest("FETCH_Project_LIST", getProjectList);
    yield takeLatest("FETCH_CREATE_PROJECT", createNewProject);
    yield takeLatest("FETCH_DELETE_PROJECT", deleteProject);
    yield takeLatest("FETCH_UPDATE_PROJECT", updateProject);


}
export default mySaga;
