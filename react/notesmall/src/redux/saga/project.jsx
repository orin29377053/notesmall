
import { takeLatest, put } from "redux-saga/effects";
import { API_METHOD } from "../api/apiService";
import { GRAPHQL_URL } from "../api/API";
import { fetchApi } from ".";


function* fetch(action) {
    yield fetchApi({
        method: API_METHOD.POST,
        path: GRAPHQL_URL,
        reducer: "Project_LIST_RESULT",
        queryString: action.payload,
    });
}

function* mySaga() {
    yield takeLatest("FETCH_Project_LIST", fetch);


}
export default mySaga;
