import React from "react";
import { format } from "timeago.js";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ userData, conversation }) => {
  return (
    <>
      {/* <div className="chat"> */}
      <ScrollToBottom className={`chat`}>
        {conversation.map((i, index) => (
          <p
            key={index}
            className={
              i.senderId.toString() === userData.data._id.toString()
                ? "self"
                : i.senderId === "Admin"
                ? "welcome"
                : "other"
            }
          >
            <span
              className={
                i.senderId.toString() === userData.data._id.toString()
                  ? "self_text_msg prem"
                  : i.senderId === "Admin"
                  ? "welcome_text"
                  : "other_text_msg prem"
              }
            >
              {i.text}{" "}
              {i.senderId !== "Admin" && (
                <span className="time">{format(i.date_time)}</span>
              )}
            </span>
          </p>
        ))}
      </ScrollToBottom>
      {/* </div> */}
    </>
  );
};

export default Chat;
