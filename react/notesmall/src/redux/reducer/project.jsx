const initState = {
    projectlist: [],
};
const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case "Project_LIST_RESULT":

            console.log(action.data.data.projects);
            return {
                ...state,
                projectlist: action.data.data.projects,
            };
        default:
            return state;
    }
};
export default projectReducer;