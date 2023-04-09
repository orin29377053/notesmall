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

function* mySaga() {
    yield takeLatest("FETCH_TAG_LIST", fetch);

}
export default mySaga;
