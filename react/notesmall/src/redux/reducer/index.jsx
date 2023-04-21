/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import editorReducer from "./editor";
import commonReducer from "./common";
import tagReducer from "./tag";
import projectReducer from "./project";
import UserReducer from "./user";

const reducer = (state = {}, action) =>
    // always return a new object for the root state
    ({
        editor: editorReducer(state.editor, action),
        common: commonReducer(state.common, action),
        tag: tagReducer(state.tag, action),
        project: projectReducer(state.project, action),
        user: UserReducer(state.user, action),
    });
export default reducer;
