import {
  Block,
  ChevronRight,
  Close,
  Delete,
  ThumbDown,
} from "@material-ui/icons";
import React from "react";

const Contact_info = (props) => {
  return (
    <>
      <div className="contact_info" style={{ display: props.contact_info }}>
        <div className="sec1_head">
          <div className="contact_info_cross">
            <Close onClick={props.handleClose} />
          </div>
          <p>Contact info</p>
        </div>
        <div className="contact_inner_box">
          <div className="profile_pic_and_name">
            <div className="profile_pic flex-div-center">
              <img src={props.chat_box_inner_detail.profilePic} alt="" />
            </div>
            <div className="profile_name">
              <p>{props.chat_box_inner_detail.name}</p>
              <span className="status_two">Online</span>
            </div>
          </div>

          <div className="media_and_links">
            <div className="media_and_links_head flex-div-space-between">
              <p>media,links,doc..</p>
              <ChevronRight />
            </div>
            <div className="media_file">
              <ul className="flex-div-space-between"></ul>
            </div>
          </div>

          <div className="msd">
            <ul>
              <li>
                <p>Mute notification</p>
                <input type="checkbox" />
              </li>
              <li>
                <p>Starred message</p>
                <ChevronRight />
              </li>
              <li>
                <p>
                  Dissapearing message <span className="on-off">off</span>
                </p>{" "}
                <ChevronRight />
              </li>
            </ul>
          </div>

          <div className="about_and_phone">
            <div className="about_and_phone_head flex-div-space-between">
              <p>about and phone</p>
            </div>
            <div className="about">
              <ul>
                <li className="visible_about">jai shree ram</li>

                <li className="mobile_no"></li>
              </ul>
            </div>
            <div className="contact_inner_box_bottom">
              <ul>
                <li className="block bl-re-de">
                  <Block /> <p>Block</p>
                </li>
                <li className="report_contact bl-re-de">
                  <ThumbDown />
                  <p>Report contact</p>
                </li>
                <li className="delete_chat bl-re-de">
                  <Delete /> <p>Delete chat</p>
                </li>
                <li
                  className="delete_chat bl-re-de"
                  style={{ visibility: "hidden" }}
                >
                  <Delete /> <p>Delete chat</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact_info;
