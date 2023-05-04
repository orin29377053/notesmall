import { takeLatest, put ,takeEvery} from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";

function* fetch(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "TAG_LIST_RESULT",
        queryString: action.payload,
    });
}


function* addTag(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "ADD_TAG",
        queryString: action.payload,
        error: "Add Tag Error",
        success: "Add Tag Success",
    });
}
function* updateTag(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "UPDATE_TAG",
        queryString: action.payload,
        error: "Update Tag Error",
        success: "Update Tag Success",
    });
}
function* deleteTag(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "DELETE_TAG",
        queryString: action.payload,
        error: "Delete Tag Error",
        success: "Delete Tag Success",
    });
}


function* mySaga() {
    yield takeLatest("FETCH_TAG_LIST", fetch);
    yield takeEvery("FETCH_ADD_TAG", addTag);
    yield takeEvery("FETCH_UPDATE_TAG", updateTag);
    yield takeEvery("FETCH_DELETE_TAG", deleteTag);

    


}
export default mySaga;
