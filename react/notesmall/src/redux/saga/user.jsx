import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";


function* fetchSignIn(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_SIGN_IN_RESULT",
        queryString: action.payload,
    });
}
function* fetchSignUp(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_SIGN_UP_RESULT",
        queryString: action.payload,
    });
}
function* fetchUserInfo(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_USER_INFO_RESULT",
        queryString: action.payload,
    });
}

function* mySaga() {
    yield takeLatest("FETCH_SIGN_IN", fetchSignIn);
    yield takeLatest("FETCH_USER_INFO", fetchUserInfo);
    yield takeLatest("FETCH_SIGN_UP", fetchSignUp);



}
export default mySaga;
