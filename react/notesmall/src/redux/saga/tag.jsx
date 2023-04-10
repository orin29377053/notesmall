import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetch(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "TAG_LIST_RESULT",
        queryString: action.payload,
    });
}


function* addTag(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "ADD_TAG",
        queryString: action.payload,
    });
}
function* updateTag(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_TAG",
        queryString: action.payload,
    });
}
function* deleteTag(action) {
    console.log(action)
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "DELETE_TAG",
        queryString: action.payload,
    });
}


function* mySaga() {
    yield takeLatest("FETCH_TAG_LIST", fetch);
    yield takeLatest("FETCH_ADD_TAG", addTag);
    yield takeLatest("FETCH_UPDATE_TAG", updateTag);
    yield takeLatest("FETCH_DELETE_TAG", deleteTag);

    


}
export default mySaga;
