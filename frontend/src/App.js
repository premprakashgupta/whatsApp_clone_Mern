import "./App.css";
import io from "socket.io-client";
import Home from "./component/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login/Login";
import { useEffect } from "react";
import SignUp from "./component/SignUp/SignUp";

// const ENDPOINT = "http://localhost:4000";
// const socket = io(ENDPOINT, { transports: ["websocket"] });
function App() {
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("socket io from app");
  //   });
  // }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>

          <Route exact path="/chat" element={<Home />}></Route>
          <Route exact path="/signup" element={<SignUp />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
