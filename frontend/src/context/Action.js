export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (mobile) => (
  console.log("action"),
  {
    type: "LOGIN_SUCCESS",
  }
);
export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});
export const Logout = () => ({
  type: "LOGOUT",
});
