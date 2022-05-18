import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";
const INITIAL_STATE = {
  userData: JSON.parse(localStorage.getItem("userData")) || null,
  isFetching: false,
  error: false,
};
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(state.userData));
  }, [state.userData]);
  return (
    <Context.Provider
      value={{
        userData: state.userData,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
