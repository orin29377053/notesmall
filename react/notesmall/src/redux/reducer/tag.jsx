const initState = {
    taglist: [],
};
const tagReducer = (state = initState, action) => {
    switch (action.type) {
        case "TAG_LIST_RESULT":
            console.log(action);
            return {
                ...state,
                taglist: action.data.data.tags,
            };
        case "ADD_TAG":
            console.log(state.taglist);
            console.log(action.data.data.createTag);
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

        case "UPDATE_CONTENT":
            console.log("action!!!!", action.payload);
            // const rr = ""
            // if (action.payload.id) { 
            //     rr = ""
            // } else {
            //     rr = state;
            // }


            if (action.payload.id) {
                return {
                    ...state,
                    taglist: state.taglist.map((tag) => {
                        return {
                            ...tag,
                            document: tag.document.map((doc) => {
                                if (doc.id === action.payload.id) {
                                    console.log("YA");
                                    return {
                                        ...doc,
                                        content: action.payload.content,
                                    };
                                } else {
                                    return doc;
                                }
                            }),
                        };
                    }),
                };
            } else {
                return state;
            }
        // update editor tag  after update tag
        case "UPDATE_TAGS_RESULT":
            const document = {
                _id: action.data.data.updatedDocument._id,
                title: action.data.data.updatedDocument.title,
                content: action.data.data.updatedDocument.content,
            };
            const tagfromdocument = action.data.data.updatedDocument.tags.map(
                (tag) => {
                    return tag._id;
                }
            );
            const newTaglist = state.taglist.reduce((acc, tag) => {
                if (tagfromdocument.includes(tag._id)) {
                    acc.push({
                        ...tag,
                        document: [...tag.document, document],
                    });
                } else {
                    const index = tag.document.findIndex(
                        (doc) => doc._id === document._id
                    );
                    if (index !== -1) {
                        acc.push({
                            ...tag,
                            document: tag.document.filter(
                                (doc) => doc._id !== document._id
                            ),
                        });
                    } else {
                        acc.push(tag);
                    }
                }
                return acc;
            }, []);
            return {
                ...state,
                taglist: newTaglist,
            };

        default:
            return state;
    }
};
export default tagReducer;
