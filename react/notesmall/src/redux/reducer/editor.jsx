import { useNavigate } from "react-router-dom";

const initState = {
    editingDocument: {},
    title: "",
    count: 0,
    selectedID: "",
};

const editorReducer = (state = initState, action) => {
    switch (action.type) {
        case "EDITING_DOCUMENT":
            return {
                ...state,
                editingDocument: action.data.data.document,
            };

        case "UPDATE_TITLE":
            console.log(action.payload.id,state.editingDocument._id)
            // console.log(state.editingDocument._id)
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
            let newContent
            if (action.payload.content) {
                newContent = action.payload.content
                return {
                    ...state,
                    editingDocument: {
                        ...state.editingDocument,
                        content: newContent,
                    },
                };
                
            } 
            
            return {
                ...state,
                
            };
        case "UPDATE_TAGS_RESULT":
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    tags: action.data.data.updatedDocument.tags,
                },
            };
        case "CREATE_DOCUMENT_RESULT":
            action.helper.history(`/${action.data.data.createDocument._id}`)
            return {
                ...state,
                editingDocument: action.data?.data.createDocument,
            };
        case "UPDATE_DOCUMENT_TITLE":
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    title: action.data.data.updatedDocument.title,
                },
            };
        case "UPDATE_DOCUMENT_PROJECT":
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    project: action.data.data.updatedDocument.project,
                },
            };

        default:
            return state;
    }
};
export default editorReducer;
