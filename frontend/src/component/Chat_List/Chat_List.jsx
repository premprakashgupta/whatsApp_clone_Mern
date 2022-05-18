import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import config from "../../reqConfig";
import UniversalLink from "../../universalLink";
const Chat_List = (props) => {
  const [allUser, setAllUser] = useState([]);
  const [friends, setFriends] = useState(props.userData.data.friends);
  useEffect(() => {
    const getAllUser = async () => {
      try {
        const { data } = await axios.get(
          `${UniversalLink}/api/v2/allUser`,
          config
        );

        setAllUser(data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllUser();
  }, [friends]);
  const handleAddme = async (id) => {
    try {
      const { data } = await axios.put(
        `${UniversalLink}/api/v2/friendMaking/${id}`,
        {},
        config
      );

      if (!props.userData.data.friends.find((i) => i._id === data.data._id)) {
        setFriends([...friends, data.data]);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...props.userData,
            data: {
              ...props.userData.data,
              friends: [...props.userData.data.friends, data.data],
            },
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const lastMsg = (id) => {
    let arr = [];
    props.userData.data.chating.forEach((z) => {
      if (
        (z.senderId === id && z.recieverId === props.userData.data._id) ||
        (z.senderId === props.userData.data._id && z.recieverId === id)
      ) {
        arr.push(z);
      }
    });

    return arr[arr.length - 1];
  };
  return (
    <div
      className="profile_list_container"
      style={{ transform: `translateX(${props.translate})` }}
    >
      <div className="main_profile_list">
        {/* <!-- profile list ------------------------------------------------------- --> */}
        <h3>Friends</h3>
        <ul>
          {friends.map((i, index) => (
            <li
              key={index}
              onClick={() =>
                props.handleChatOpen(
                  i._id,
                  i.username,
                  i.profilePic,
                  i.last_seen
                )
              }
            >
              <img src={i.profilePic} alt="" />
              <div className="profile_detail">
                <div className="profile_name_and_time flex-div-space-between">
                  <div className="name_indicator_time">
                    <span className="name">{i.username}</span>
                    <span>
                      {props.OnlineUser.some((p) => p.userId === i._id) && (
                        <small></small>
                      )}

                      <b className="time">
                        {format(lastMsg(i._id)?.date_time)}
                      </b>
                    </span>
                  </div>
                  <span className="reciever_number">995580</span>
                  <span className="reciever_about"></span>
                </div>
                <p>
                  {lastMsg(i._id)?.text
                    ? lastMsg(i._id)?.senderId !== i._id
                      ? "You:" + lastMsg(i._id)?.text
                      : lastMsg(i._id)?.text
                    : "You haven't talk to each other"}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* // <!-- end ------------------------------------------------------- --> */}
      </div>
      <div
        className="available_users main_profile_list"
        style={{ width: "50%" }}
      >
        <h3>All Users</h3>
        <ul>
          {allUser.map((i, index) => (
            <li key={index}>
              <img src={i.profilePic} alt="" />
              <div className="profile_detail">
                <div className="profile_name_and_time flex-div-space-between">
                  <div className="name_indicator_time">
                    <span>{i.username}</span>
                    <span>
                      {props.OnlineUser.some((p) => p.userId === i._id) && (
                        <small></small>
                      )}
                      <button onClick={() => handleAddme(i._id)}>Add me</button>
                    </span>
                  </div>
                  <span className="reciever_number">995580</span>
                  <span className="reciever_about"></span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat_List;
