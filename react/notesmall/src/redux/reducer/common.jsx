import _ from "lodash";
const initState = {
    sidebar: [],
    searchKeyword: "",
    searchResult: [],

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

        default:
            return state;
    }
};
export default commonReducer;
