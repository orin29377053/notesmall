import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetchSignIn(action) {
    const response = yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_SIGN_IN_RESULT",
        queryString: action.payload,
        success: "Sign in Success",
    });
    if (response) {
        yield put({
            type: "USER_DOCUMENTS_LIST",
            data: response.data.signin.documents,
        });

        yield put({
            type: "USER_PROJECTS_LIST",
            data: response.data.signin.projects,
        });
        yield put({
            type: "USER_TAGS_LIST",
            data: response.data.signin.tags,
        });
    }
}
function* fetchSignUp(action) {
    
    yield put({
        type: "FETCH_SIGN_UP_RESULT",
        data: action.payload,
    });

    yield put({
        type: "USER_DOCUMENTS_LIST",
        data: action.payload.data.signup.documents,
    });
    yield put({
        type: "USER_PROJECTS_LIST",
        data: action.payload.data.signup.projects,
    });
    yield put({
        type: "USER_TAGS_LIST",
        data: action.payload.data.signup.tags,
    });
}

function* fetchUserInfo(action) {
    const response = yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "FETCH_USER_INFO_RESULT",
        queryString: action.payload,
    });

    if (response) {
        yield put({
            type: "USER_DOCUMENTS_LIST",
            data: response.data.me.documents,
        });
        yield put({
            type: "USER_PROJECTS_LIST",
            data: response.data.me.projects,
        });
        yield put({
            type: "USER_TAGS_LIST",
            data: response.data.me.tags,
        });
    }
}

function* mySaga() {
    yield takeLatest("FETCH_SIGN_IN", fetchSignIn);
    yield takeLatest("FETCH_USER_INFO", fetchUserInfo);
    yield takeLatest("FETCH_SIGN_UP", fetchSignUp);
}
export default mySaga;
