const initState = {
    taglist: [],
};
const tagReducer = (state = initState, action) => {
    switch (action.type) {
        case "TAG_LIST_RESULT":
            return {
                ...state,
                taglist: action.data.data.tags,
            };
        case "ADD_TAG":
            return {
                ...state,
                taglist: [...state.taglist, action.data.data.createTag],
            };
        case "UPDATE_TAG":
            return {
                ...state,
                taglist: state.taglist.map((tag) => {
                    if (tag._id === action.data.data.updatedTag._id) {
                        return action.data.data.updatedTag;
                    } else {
                        return tag;
                    }
                }),
            };
        case "DELETE_TAG":
            return {
                ...state,
                taglist: state.taglist.filter((tag) => {
                    return tag._id !== action.data.data.deleteTag._id;
                }),
            };
        case "USER_TAGS_LIST":
            return {
                ...state,
                taglist: action.data,
            };

        default:
            return state;
    }
};
export default tagReducer;
