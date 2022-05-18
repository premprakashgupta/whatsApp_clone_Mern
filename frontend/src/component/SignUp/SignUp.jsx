import { MobileFriendly } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import config from "../../reqConfig";
import UniversalLink from "../../universalLink";
import "./SignUp.css";
const SignUp = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);
  const [mobile, setMobile] = useState("");
  useEffect(() => {
    setMobile(
      localStorage.getItem("78498379432028-whatsaaSignMobileNumber76r478647548")
    );
  }, []);

  const handleUsername = async () => {
    try {
      const { data } = await axios.post(
        `${UniversalLink}/api/v2/create`,
        {
          mobile,
        },
        config
      );

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });
      data.data &&
        localStorage.removeItem(
          "78498379432028-whatsaaSignMobileNumber76r478647548"
        );

      navigate("/chat");
    } catch (error) {
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
        <div className="center_container signUp">
          <div className="signUpBox">
            <p>Hey ! you are going to sign-up with this mobile number</p>
            <small>
              <MobileFriendly /> +91 {mobile}
            </small>
            <span>
              <button
                className="btn"
                onClick={() => {
                  navigate("/");
                  localStorage.removeItem(
                    "78498379432028-whatsaaSignMobileNumber76r478647548"
                  );
                }}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleUsername}>
                Confirm
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
