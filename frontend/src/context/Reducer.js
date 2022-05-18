const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        userData: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        userData: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        userData: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        userData: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};
export default Reducer;
