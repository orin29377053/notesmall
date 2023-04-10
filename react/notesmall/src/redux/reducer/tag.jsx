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
            console.log(action.data)
            return {
                ...state,
                taglist: [...state.taglist, action.data.data.createTag
                ],
            };
        case "UPDATE_TAG":
            console.log(action.data.data.updatedTag)
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
            console.log(action.data)
            return {
                ...state,
                taglist: state.taglist.filter((tag) => {    
                    return tag._id !== action.data.data.deleteTag._id;
                }),
            };


        default:
            return state;
    }
}
export default tagReducer;
