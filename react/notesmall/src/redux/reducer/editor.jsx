const initState = {
    editingDocument: {},
    title: "",
    count: 0,
};

const editorReducer = (state = initState, action) => {
    switch (action.type) {
        case "EDITING_DOCUMENT":
            return {
                ...state,
                editingDocument: action.payload.editingDocument,
            };
        case "UPDATE_TITLE":
            console.log(action)
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    title: action.payload.title,
                },
            };
        case "COUNT":
            return {
                ...state,
                count: action.payload.count,
            };
        case "UPDATE_CONTENT":
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    content: action.payload.content,
                },
            };
        default:
            return state;
    }
};
export default editorReducer;
