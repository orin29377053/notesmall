export const editingDocument = (editingDocument) => ({
    type: "EDITING_DOCUMENT",
    payload: {
        editingDocument,
    },
});

export const updatingTitle = (title) => ({
    type: "UPDATING_TITLE",
    payload: {
        title,
    },
});
export const count = (count) => ({
  type: "COUNT",
  payload: {
    count,
  },
});
