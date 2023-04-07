const initState = {
    editingDocument: {},
    title: "",
    count: 0,
};

const documentReducer = (state = initState, action) => {
    switch (action.type) {
        case "EDITING_DOCUMENT":
            return {
                ...state,
                editingDocument: action.payload.editingDocument,
            };
        case "UPDATING_TITLE":
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
        case "UPDATING_CONTENT":
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    content: action.payload.content,
                },
            };
    }
};
export default documentReducer;
