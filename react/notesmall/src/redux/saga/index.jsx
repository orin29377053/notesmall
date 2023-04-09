import { all, put } from "redux-saga/effects";
// import Cookies from 'js-cookie';
import _ from "lodash";
import { API_METHOD, APIKit } from "../api/apiService";
import edit from "./edit";
import common from "./common";
import tag from "./tag";

export function* fetchApi({
    method,
    path,
    reducer = null,
    failValue = null,
    params = {},
    parameters = null,
    queryString = null,
}) {
    let result = failValue;
    let success = false;

    const { gqlMethod, api, format, response } = queryString;
    let query = `${gqlMethod}{${api}${format ?? ""} { ${response} }}`;
    // if (!api || !format) {
    //     query = `${gqlMethod}{{ ${response} }}`
    // } else {
    //     query = `${gqlMethod}{${api}${format??""} { ${response} }}`;
    // }
    params = {
        ...params,
        headers: { "Content-Type": "application/json" },
    };

    try {
        const { data: response } =
            method === API_METHOD.GET || method === API_METHOD.DELETE
                ? yield APIKit[method](path, params)
                : yield APIKit[method](path, JSON.stringify({ query }), params);
        result = response;
        success = true;
    } catch (error) {
        console.log(error.response);
        alert(error.response?.data?.errors[0]?.message);

    }

    //有設定 reducer才會呼叫
    if (reducer)
        yield put({ type: reducer, data: result, parameters: parameters });

    return result;
}

function* rootSaga() {
    yield all([edit(), common(), tag()]);
}

export default rootSaga;
