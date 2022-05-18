import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import axios from "axios";

import "./Login.css";
import config from "../../reqConfig";
import UniversalLink from "../../universalLink";
const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);
  const [mobile, setMobile] = useState("");
  const handleUsername = async (e) => {
    e.preventDefault();
    if (mobile === "" || !mobile.match("^[0-9]*$")) {
      return alert("Number is Required");
    }
    if (mobile.length !== 10) {
      return alert("10 digit number is Required");
    }

    dispatch({ type: "LOGIN_START" });
    try {
      const userCount = await axios.post(
        `${UniversalLink}/api/v2/findUser`,
        {
          mobile,
        },
        config
      );
      console.log(userCount.data.userAvailability);
      if (userCount.data.userAvailability === 0) {
        localStorage.setItem(
          "78498379432028-whatsaaSignMobileNumber76r478647548",
          mobile
        );
        navigate("/signUp");
      } else {
        const { data } = await axios.post(
          `${UniversalLink}/api/v2/login`,
          {
            mobile,
          },
          config
        );

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: data,
        });
        navigate("/chat");
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
      });
      alert(error.message);
    }
  };
  return (
    <>
      <div className="logo">
        <img src="image/1523999-middle.png" alt="" />
        <span>whatsApp</span>
      </div>

      <div className="container-fluid">
        <div className="center_container">
          <div className="row">
            <div className="col-sm-12 col-md-9 col-xl-9">
              <h1 className="my-3">To use whatsApp on your computer :</h1>
              <p>1. Please enter correct details</p>
              <p>2. After filling all section</p>
              <p>3. Click on login</p>
            </div>
            <div className="col-sm-12 col-md-3 col-xl-3">
              <form>
                <h3>Login/SingUp</h3>
                <div className="form-group">
                  <label htmlFor="mobile_No">Mobile Number :</label>
                  <input
                    type="text"
                    placeholder="Enter 10 digit mobile no."
                    className="form-control"
                    id="mobile_No"
                    autoComplete="off"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Submit"
                    onClick={handleUsername}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col about_website">
              <h3 className="my-3">About website : </h3>
              <p>1.This website is only for practice purpose</p>
              <p>
                2. all pages are design mannually and very few code of bootstrap
                is used
              </p>
              <p>
                3. Full website is on based on PHP , Ajax , Jquery , HTML and
                CSS
              </p>
              <h3 className="about_developer">About Developer : </h3>
              <p>
                1. currently pursuing B.Tech from Nalanda College of
                Engineering,Chandi in{" "}
              </p>
              <p>2. Computer Science and Engineering</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="float-right">
                {" "}
                <span className="thank_you">Thank you</span> <br />{" "}
                <span className="developer_name">PREM PRAKASH GUPTA</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
