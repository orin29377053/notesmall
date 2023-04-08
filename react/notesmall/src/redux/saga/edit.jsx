import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetch(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        // reducer: "UPDATE_TITLE",
        queryString: action.payload,
    });
}

function* mySaga() {
    yield takeLatest("EDIT_TITLE", fetch);
}

export default mySaga;
