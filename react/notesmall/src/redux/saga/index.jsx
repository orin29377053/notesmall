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
    queryString = null,
}) {
    let result;
    const token = localStorage.getItem("token");

    const { gqlMethod, api, format, response } = queryString;
    let query = `${gqlMethod}{${api}${format ?? ""} { ${response} }}`;

    // params = {
    //     ...params,
    //     headers: { "Content-Type": "application/json" },
    // };

    try {
        // const { data: response } = yield APIKit[method](
        //     path,
        //     JSON.stringify({ query }),
        //     params
        // );

        const response = yield fetch(graphqlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token ?? "",
            },
            body: JSON.stringify({ query }),
        }).then((res) => res.json());
        // console.log(response)

        // result = response;
        if (response.errors) {
            alert(response.errors[0].message);
            return;
        } else {
            if (reducer)
                yield put({
                    type: reducer,
                    data: response,
                    params: params,
                    helper: helper,
                });
        }
        return response
    } catch (error) {
        console.log(error);
        // alert(error.response?.data?.errors[0]?.message);
        // alert(error)
    }

    //有設定 reducer才會呼叫

    return result;
}

function* rootSaga() {
    yield all([edit(), common(), tag(), project(), user()]);
}

export default rootSaga;
