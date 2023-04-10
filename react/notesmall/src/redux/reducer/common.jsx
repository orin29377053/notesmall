import _ from "lodash";
const initState = {
    sidebar: [],
    searchKeyword: "",
    searchResult: [],
    // selectedID: "",
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
        //TODO: add document

        case "ADD_DOCUMENT_RESULT":
            // console.log(action);
            // index = _.findIndex(state.sidebar, {
            //     _id: action.data?.data?.deleteDocument._id,
            // });
            // state.sidebar.splice(index, 1);
            return {
                ...state,
                // sidebar: action.data?.data?.documents,
            };
        case "SEARCH_LIST_RESULT":
            console.log(action);
            return {
                ...state,
                searchResult: action.data?.data?.searchDocuments,
            };

        case "SEARCH_KEYWORD":
            return {
                ...state,
                searchKeyword: action.payload.keyword,
            };
        case "UPTATE_SIDE_BAR_LIST":
            console.log(action.payload);
            console.log(state.sidebar);
            return {
                ...state,
                sidebar: state.sidebar.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                ),
            };
        case "NEW_SIDE_BAR_LIST":
            console.log(action.payload);
            console.log(state.sidebar);
            return {
                ...state,
                sidebar: [...state.sidebar, action.payload],
            };

        default:
            return state;
    }
};
export default commonReducer;
