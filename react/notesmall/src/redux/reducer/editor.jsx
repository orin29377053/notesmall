import { useNavigate } from "react-router-dom";

const initState = {
    editingDocument: {},
    title: "",
    count: 0,
};

const editorReducer = (state = initState, action) => {
    switch (action.type) {
        case "EDITING_DOCUMENT":
            console.log(action);

            return {
                ...state,
                editingDocument: action.data.data.document
                    
            };

        case "UPDATE_TITLE":
            console.log(action);
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
        case "UPDATE_TAGS_RESULT":
            console.log(action);
            return {
                ...state,
                editingDocument: {
                    ...state.editingDocument,
                    tags: action.data.data.updatedDocument.tags,
                },
            };
        case "CREATE_DOCUMENT_RESULT":
            console.log(action);
            
            return {
                ...state,  
                editingDocument: action.payload,  
            };
        

        default:
            return state;
    }
};
export default editorReducer;
