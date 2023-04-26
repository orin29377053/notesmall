const initState = {
    projectlist: [],
};
const projectReducer = (state = initState, action) => {
    switch (action.type) {
        case "Project_LIST_RESULT":

            // console.log(action.data.data.projects);
            return {
                ...state,
                projectlist: action.data.data.projects,
            };
        case "CREATE_PROJECT_RESULT":
            console.log(action.data.data.createProject);
            return {
                ...state,
                projectlist: [...state.projectlist, action.data.data.createProject],
            };
        case "DELETE_PROJECT_RESULT":
            console.log(action.data.data);
            return {
                ...state,
                projectlist: state.projectlist.filter(
                    (item) => item._id !== action.data.data.deleteProject._id
                ),
            };
        case "UPDATE_PROJECT_RESULT":
            console.log(action.data.data);
            return {
                ...state,
                projectlist: state.projectlist.map((item) =>
                    item._id === action.data.data.updateProject._id

                        ? action.data.data.updateProject
                        : item
                ),
            };
            case "USER_PROJECTS_LIST":

            // console.log(action.data.data.projects);
            return {
                ...state,
                projectlist: action.data,
            };
        
        
        default:
            return state;
    }
};
export default projectReducer;