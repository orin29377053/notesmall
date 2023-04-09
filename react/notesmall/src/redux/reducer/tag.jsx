const initState = {
    taglist: [],

};
const tagReducer = (state = initState, action) => {
    switch (action.type) {
        case "TAG_LIST_RESULT":
            console.log(action.data.data.tags)
            return {
                ...state,
                taglist: action.data.data.tags,
            };
        case "ADD_TAG":
            return {
                ...state,
                taglist: [...state.taglist, action.payload.tag],
            };
        default:
            return state;
    }
}
export default tagReducer;
