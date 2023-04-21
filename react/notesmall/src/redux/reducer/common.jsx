import _ from "lodash";
const initState = {
    sidebar: [],
    searchKeyword: "",
    searchResult: [],
    searchResultDetail: [],
    selectedID: "",
    path: "",
};

const commonReducer = (state = initState, action) => {
    let index;
    let variable;
    let res;
    switch (action.type) {
        case "FETCH_SIDEBAR_LIST_RESULT":
            console.log(action);
            return {
                ...state,
                sidebar: action.data?.data?.documents,
            };
        case "DELETE_SIDEBAR_LIST_RESULT":
            index = _.findIndex(state.sidebar, {
                _id: action.data?.data?.deleteDocument._id,
            });
            state.sidebar.splice(index, 1);
            return {
                ...state,
                // sidebar: action.data?.data?.documents,
            };
        
        case "PERMENT_DELETE_SIDEBAR_LIST_RESULT":
            console.log(action.data?.data);

            index = _.findIndex(state.sidebar, {
                _id: action.data?.data?.permantDeleteDocument._id,
            });
            state.sidebar.splice(index, 1);
            return {
                ...state,
                // sidebar: action.data?.data?.documents,
            };
        
        case "SEARCH_LIST_RESULT":
            res = action.data?.data?.searchDocuments;
            res.forEach((item, i) => {
                variable = _.groupBy(item.highlights, "path");
                res[i].highlights = variable;
            });
            return {
                ...state,
                searchResult: res,
            };

        case "SEARCH_KEYWORD":
            return {
                ...state,
                searchKeyword: action.payload.keyword,
            };
        case "UPTATE_SIDE_BAR_LIST":
            return {
                ...state,
                sidebar: state.sidebar.map((item) =>
                    item._id === action.payload._id ? action.payload : item
                ),
            };
        case "CREATE_DOCUMENT_RESULT":
            variable = {};
            variable.title = action.data?.data.createDocument.title;
            variable._id = action.data?.data.createDocument._id;
            variable.updated_at = action.data?.data.createDocument.updated_at;
            return {
                ...state,
                sidebar: [...state.sidebar, variable],
                selectedID: action.data?.data?.createDocument._id,
            };
        case "CHANGE_DOCUMENT":
            // console.log(action.payload.id);
            return {
                ...state,
                selectedID: action.payload.id,
            };

        case "UPDATE_DOCUMENT_TITLE":
            // console.log(action.data.data.updatedDocument);
            // console.log(state.sidebar);
            return {
                ...state,
                sidebar: state.sidebar.map((item) =>
                    item._id === action.data.data.updatedDocument._id
                        ? action.data.data.updatedDocument
                        : item
                ),
            };
        case "UPDATE_PATH":
            return {
                ...state,
                path: action.payload.path,
            };

        default:
            return state;
    }
};
export default commonReducer;
