import _ from "lodash";
const initState = {
    sidebar: [],
};

const commonReducer = (state = initState, action) => {
    let index;
    switch (action.type) {
        case "FETCH_SIDEBAR_LIST_RESULT":
            return {
                ...state,
                sidebar: action.data?.data?.documents,
            };
        case "DELETE_SIDEBAR_LIST_RESULT":
            console.log(action);
            index = _.findIndex(state.sidebar, {
                _id: action.data?.data?.deleteDocument._id,
            });
            state.sidebar.splice(index, 1);
            return {
                ...state,
                // sidebar: action.data?.data?.documents,
            };
        default:
            return state;
    }
};
export default commonReducer;
