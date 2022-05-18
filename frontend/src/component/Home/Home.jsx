import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Home.css";
import {
  AttachFile,
  Chat,
  Check,
  Close,
  CloudUpload,
  Create,
  Image,
  KeyboardArrowDown,
  Laptop,
  Mic,
  MoreVert,
  NotificationsOff,
  Search,
  Send,
  SentimentSatisfied,
  Sync,
} from "@material-ui/icons";
import Chat_List from "../Chat_List/Chat_List";
import Chat_box from "../Chat_box/Chat_box";
import Contact_info from "../Contact_info/Contact_info";
import { Context } from "../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../reqConfig";
import { format } from "timeago.js";
import UniversalLink from "../../universalLink";
// ------------------------------------------socket start--------------------------
const ENDPOINT = "http://localhost:4000";

function Home(props) {
  const Navigate = useNavigate(); // browser history
  const { userData, dispatch } = useContext(Context); // gathered user data
  const socket = useRef(); // stable socket connection
  const [OnlineUser, setOnlineUser] = useState([]); //online user which is connected to socket io
  useEffect(() => {
    socket.current = io(ENDPOINT, { transports: ["websocket"] });
    socket.current.on("getMessage", (data) => {
      //geting msg from server which is send by sender
      setArrivalMessage({
        senderId: data.senderId,
        recieverId: data.recieverId,
        text: data.text,
        date_time: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("connect", () => {
      // socket io connection
      console.log("socket io from home");
    });
    socket.current.emit("addUser", userData.data._id); // adding new user with socket
    socket.current.on("welcome", ({ username, message }) => {
      // welcome for user when user join
      console.log(username, message);
    });
    socket.current.on("allUser", (data) => {
      setOnlineUser(data); //all online user
    });
  }, []);
  // ----------------------------------socket end-----------------------------------------------------------------
  useEffect(() => {
    if (!userData?.data?.mobile) {
      Navigate("/"); // when user not authenticate dont show chat page
    }
  }, []);

  const [contentClass, setContentClass] = useState("block");
  const [chat_box_inner, setChat_box_inner] = useState("none");
  const [menu, setMenu] = useState("none");
  const [translate, setTranslate] = useState("0%");
  const [chat_box_inner_detail, setChat_box_inner_detail] = useState({});
  const [conversation, setConversation] = useState([]);
  const [msg, setMsg] = useState("");
  const [arrivalMsg, setArrivalMessage] = useState(null);

  const handleChatOpen = (id, name, profilePic, last_seen) => {
    // function to open chat when click
    setContentClass("none");
    setChat_box_inner("block");
    setChat_box_inner_detail({ id, name, profilePic, last_seen });
  };
  const [contact_info, setContact_info] = useState("none");
  const handleOpenContactInfo = () => {
    //contact info fit when click on chat list
    setContact_info("block");
  };
  const handleClose = () => {
    //contact list close
    setContact_info("none");
  };
  useEffect(() => {
    //geting conversation of particular user
    const getConversation = async () => {
      const res = await axios.get(
        `${UniversalLink}/api/v2/message/${chat_box_inner_detail.id}`,
        config
      );
      setConversation(res.data.data);
    };
    getConversation();
  }, [chat_box_inner_detail.id]);

  const handleSendMsg = async (e) => {
    // msg sending when click on send
    e.preventDefault();
    if (msg === "") {
      return false;
    }

    socket.current.emit("sendMessage", {
      //sending msg to server socket
      senderId: userData.data._id,
      recieverId: chat_box_inner_detail.id,
      text: msg,
    });

    try {
      const data = await axios.put(
        //insert msg into database
        `${UniversalLink}/api/v2/insertMessage/${chat_box_inner_detail.id}`,
        {
          message: msg,
        },
        config
      );

      data &&
        setConversation([
          //update conversation when user send msg
          ...conversation,
          {
            senderId: userData.data._id,
            recieverId: chat_box_inner_detail.id,
            text: msg,
            date_time: Date.now(),
          },
        ]);
      // update user data in local storage when user send msg
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...userData,
          data: {
            ...userData.data,
            chating: [
              ...userData.data.chating,
              {
                senderId: userData.data._id,
                recieverId: chat_box_inner_detail.id,
                text: msg,
                date_time: Date.now(),
              },
            ],
          },
        })
      );
      setMsg("");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // update conversation when msg come
    arrivalMsg &&
      chat_box_inner_detail.id === arrivalMsg.senderId && // update conversation when particulare reciever is open
      setConversation((prev) => [...prev, arrivalMsg]);
    //update user in localStorg when friend send msg
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        data: {
          ...userData.data,
          chating: [...userData.data.chating, arrivalMsg],
        },
      })
    );
  }, [arrivalMsg]);

  const handleLogOut = async () => {
    //logout handle
    setMenu("none");
    try {
      const data = await axios.get(`${UniversalLink}/api/v2/logout`, config);
      dispatch({
        type: "LOGOUT",
      });
      data && Navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(OnlineUser);
  return (
    <div>
      {/* <span className="info_for_screen_size">Sorry, Not supported in mobile.</span> */}

      <div className="container-fluid">
        <div className="profile_list">
          <div className="user_profile flex-div-space-between">
            <div className="user_profile_img">
              <img src={userData?.data?.profilePic} alt="" />
              <span>{userData?.data?.username}</span>
            </div>
            <div className="user_profile_operation">
              <ul className="flex-div-space-around">
                <li id="status">
                  <Sync />
                </li>
                <li>
                  <Chat
                    onClick={() =>
                      setTranslate(translate === "0%" ? "-50%" : "0%")
                    }
                  />
                  <ul className="about_box">
                    <div className="about_input">
                      <input type="text" value="" disabled /> <Check />
                      <Create />
                    </div>

                    <p>Change your About .............</p>
                  </ul>
                </li>
                <li>
                  <MoreVert
                    onClick={() => setMenu(menu === "block" ? "none" : "block")}
                  />
                  <ul className="profile_menu_ul" style={{ display: menu }}>
                    <li className="new">New group</li>
                    <li>Create a room</li>
                    <li>Profile</li>
                    <li>Archieved</li>
                    <li>Starred</li>
                    <li>Setting</li>
                    <li className="logout" onClick={handleLogOut}>
                      Log out
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="notification_info d-flex">
            <div className="notification_icon">
              <NotificationsOff />
            </div>
            <div className="notification_msg">
              <p>Get notified on new message</p>
              <a href="#">Turn on desktop notifications</a>
            </div>
          </div>
          <div className="search_box flex-div-space-between">
            <div className="search_icon flex-div-center">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search or start new chat"
              id="search_input"
            />
          </div>
          {/* chat_List  */}
          <Chat_List
            handleChatOpen={handleChatOpen}
            userData={userData}
            translate={translate}
            OnlineUser={OnlineUser}
          />
        </div>
        <div className="chat_box flex-div-center">
          <div className="content" style={{ display: contentClass }}>
            <img src="/image/pre_chat.jpg" alt="" />
            <div className="connect_info">
              <h1>Keep your phone connected</h1>
              <p>
                WhatsApp connects to your phone to sync messages. To reduce data
                usage, connect your phone to Wi-Fi.
              </p>
            </div>
            <div className="download_here flex-div-center">
              <div className="download_here_info flex-div-space-around">
                <Laptop />
                <p className="m-0">WhatsApp is available for Windows. </p>
                <a href="#">Get it here</a>
              </div>
            </div>
          </div>
          <div className="chat_box_inner" style={{ display: chat_box_inner }}>
            <div className="chat_profile_section flex-div-space-between">
              <div className="chat_img_and_name flex-div-space-between">
                <img src={chat_box_inner_detail.profilePic} alt="" />
                <div className="name_and_time mx-3">
                  <p className="chat_person_name">
                    {chat_box_inner_detail.name}
                  </p>
                  <p className="online_status">
                    {OnlineUser.some(
                      (i) => i.userId === chat_box_inner_detail.id
                    )
                      ? "Online"
                      : format(chat_box_inner_detail.last_seen)}
                  </p>
                </div>
              </div>
              <div
                className="click_space_for_contact_info"
                onClick={() => handleOpenContactInfo()}
              ></div>
              <div className="chat_profile_menu_and_search flex-div-space-between">
                <div className="chat_search">
                  <Search />
                </div>
                <div className="chat_menu">
                  <MoreVert />

                  <ul className="chat_menu_ul">
                    <li>Contact info</li>
                    <li>Report business</li>
                    <li>Block</li>
                    <li>Select messages</li>
                    <li>Mute notifications</li>
                    <li>Clear messages</li>
                    <li>Delete chat</li>
                  </ul>
                </div>
              </div>
            </div>

            <Chat_box
              userData={userData}
              chat_box_inner_detail={chat_box_inner_detail}
              conversation={conversation}
            />
            <form className="chat_bottom_section flex-div-space-around">
              <div className="emoji">
                <SentimentSatisfied />
                <div className="emoji_box">
                  <ul>
                    <li>&#128513;</li>
                  </ul>
                </div>
              </div>
              <div className="clip_icon">
                <AttachFile />
              </div>
              <input
                type="text"
                value={msg}
                placeholder="Type a message"
                id="chat_input"
                onChange={(e) => setMsg(e.target.value)}
              />
              <div className="mic">
                <Mic />
              </div>
              <button type="submit" className="send" onClick={handleSendMsg}>
                <Send />
              </button>
            </form>
          </div>

          <Contact_info
            contact_info={contact_info}
            chat_box_inner_detail={chat_box_inner_detail}
            handleClose={handleClose}
          />

          {/* <!-- media file sec -------------------------------------------------------------------- --> */}

          {/* <!-- all content above it ------------------------------------------------------- --> */}
        </div>
      </div>

      {/* <!-- box 1 ---------------------------------------------------- --> */}
      <div className="profile_update_box outerbox flex-div-center">
        <div className="box">
          <form id="submit_form">
            <div className="upper_input_box flex-div-center">
              <label htmlFor="profile_picture_for_update">
                <CloudUpload className="outerbox_icon" />
              </label>
              <input
                type="file"
                name="profile_picture_for_update"
                id="profile_picture_for_update"
              />
            </div>
            <div className="lower_input_box flex-div-space-around">
              <input
                type="button"
                className="update_box_close"
                value="Cancel"
              />{" "}
              <input type="submit" value="Update" />
            </div>
          </form>
        </div>
      </div>
      {/* <!-- box 2 ------------------------------------------------------------- --> */}

      <div className="photo_send_box outerbox flex-div-center">
        <div className="box">
          <form id="submit_form_photo">
            <div className="upper_input_box flex-div-center">
              <label htmlFor="foto_send_file">
                <Image className="outerbox_icon" />
              </label>
              <input type="file" name="photo_send_file" id="foto_send_file" />
            </div>
            <div className="lower_input_box flex-div-space-around">
              <input
                type="button"
                className="photo_send_box_close"
                value="Cancel"
              />{" "}
              <input type="submit" value="send " />
            </div>
          </form>
        </div>
      </div>
      {/* <!-- box 3--------------------------------------------------------- --> */}
      <div className="photo_preview flex-div-center">
        <div className="box">
          <img src="" alt="" />
          <Close className="photo_preview_close" />
        </div>
      </div>
    </div>
  );
}

export default Home;
