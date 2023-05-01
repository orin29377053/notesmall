import _, { concat } from "lodash";
const initState = {
    sidebar: [],
    searchKeyword: "",
    searchResult: [],
    searchResultDetail: [],
    selectedID: "",
    path: "",
    information: {},
};

const commonReducer = (state = initState, action) => {
    let index;
    let variable;
    let res;
    switch (action.type) {
        case "FETCH_SIDEBAR_LIST_RESULT":
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
            console.log("res", res);
            if (res.length === 0) {
                res.push("No result found");
            } else {
                res.forEach((item, i) => {
                    variable = _.groupBy(item.highlights, "path");
                    res[i].highlights = variable;
                });
            }

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
        case "USER_DOCUMENTS_LIST":
            return {
                ...state,
                sidebar: action.data,
            };
        case "FETCH_RESULT_INFORMATION":
            return {
                ...state,
                information: action.data,
            };

        case "CLEAR_SEARCH_RESULT":
            return {
                ...state,
                searchResult: [],
            };

        case "RESTORE_SIDEBAR_LIST_RESULT":
            const restoredDocumentId = action.data.data.deleteDocument._id;
            const updatedSidebar = state.sidebar.map((item) => {
                if (item._id === restoredDocumentId) {
                    return {
                        ...item,
                        isDeleted: false,
                    };
                }
                return item;
            });
            return {
                ...state,
                sidebar: updatedSidebar,
            };
        
        case "UPDATE_FAVORITE":
            const updatedFavoriteSidebar = state.sidebar.map((item) => {
                if (item._id === action.payload.id) {
                    return {
                        ...item,
                        isFavorite: action.payload.isFavorite,
                    };
                }
                return item;
            });
            return {
                ...state,
                sidebar: updatedFavoriteSidebar,
            };
        

        default:
            return state;
    }
};
export default commonReducer;
