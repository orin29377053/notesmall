import { all, put } from "redux-saga/effects";
import _ from "lodash";
import edit from "./edit";
import common from "./common";
import tag from "./tag";
import project from "./project";
import user from "./user";
import { graphqlAPI } from "../../utils/const";

export function* fetchApi({
    reducer = null,
    // failValue = null,
    params = null,
    helper = null,
    // parameters = null,
    // token=null,
    error = null,
    success = null,
    queryString = null,
}) {
    let result;
    const token = localStorage.getItem("token");

    const { gqlMethod, api, format, response } = queryString;
    let query = `${gqlMethod}{${api}${format ?? ""} { ${response} }}`;

    try {
        const response = yield fetch(graphqlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token ?? "",
            },
            body: JSON.stringify({ query }),
        }).then((res) => res.json());

        if (response.errors) {
            console.log("dwdw",response.errors);
            yield put({
                type: "FETCH_RESULT_INFORMATION",
                data: {
                    type: "error",
                    title: "Error",
                    message: error ?? response.errors[0]?.message ?? "Unknown error occurred",
                },
            });
            if (helper) {
                try {
                    helper.history("/home");
                } catch {
                    return;
                }
            }
            return;
        } else {
            if (success) {
                console.log("success",success);
                yield put({
                    type: "FETCH_RESULT_INFORMATION",
                    data: {
                        type: "success",
                        title: "Success",
                        message: success,
                    },
                });
            }
            if (reducer)
                yield put({
                    type: reducer,
                    data: response,
                    params: params,
                    helper: helper,
                });
        }
        console.log("hello");
        return response;
    } catch (e) {
        console.log(e);
        if (error) {
            yield put({
                type: "FETCH_RESULT_INFORMATION",
                data: {
                    type: "error",
                    title: "Error",
                    message: error,
                },
            });
        }
    }

    //有設定 reducer才會呼叫

    return result;
}

function* rootSaga() {
    yield all([edit(), common(), tag(), project(), user()]);
}

export default rootSaga;
