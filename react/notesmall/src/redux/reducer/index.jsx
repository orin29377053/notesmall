/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import editorReducer from "./editor";
import commonReducer from "./common";

const reducer = (state = {}, action) =>
    // always return a new object for the root state
    ({
        editor: editorReducer(state.editor, action),
        common: commonReducer(state.common, action),
    });
export default reducer;
