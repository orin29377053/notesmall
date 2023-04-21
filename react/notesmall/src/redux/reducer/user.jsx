const initState = {
    user: {},
    token: "",
};

const UserReducer = (state = initState, action) => {
    switch (action.type) {
        case "FETCH_SIGN_IN_RESULT":
            console.log(action);
            window.localStorage.setItem("token", action.data.data.signin.token);
            return {
                ...state,
                user: action.data.data.signin,
                token: action.data.data.signin.token,
            };

        case "FETCH_SIGN_UP_RESULT":
            console.log(action);
            window.localStorage.setItem("token", action.data.data.signup.token);
            return {
                ...state,
                user: action.data.data.signup,
                token: action.data.data.signup.token,
            };
        case "FETCH_USER_INFO_RESULT":
            console.log(action);

            window.localStorage.setItem("token", action.data.data.me.token);

            return {
                ...state,
                user: action.data.data.me,
                token: action.data.data.me.token,
            };
        case "LOGOUT":
            window.localStorage.removeItem("token");
            return {
                ...state,
                user: {},
                token: "",
            };
        default:
            return state;
    }
};
export default UserReducer;
