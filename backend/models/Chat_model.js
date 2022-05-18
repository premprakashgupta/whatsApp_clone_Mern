const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ChatSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: Number,
    trim: true,
    required: true,
  },
  profilePic: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSchema",
    },
  ],
  chating: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSchema",
      },
      recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSchema",
      },
      text: {
        type: String,
      },
      date_time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  last_seen: {
    type: Date,
  },
});
ChatSchema.pre("save", function (next) {
  if (typeof this.get("username") === "undefined") {
    this.username = this.get("mobile");
  }
  if (typeof this.get("profilePic") === "undefined") {
    let randomNumber = Math.floor(Math.random() * 16) + 1;
    this.profilePic = "/avatar/avatar" + randomNumber + ".png";
  }
  next();
});
ChatSchema.methods.generateJWTtoken = function (params) {
  return jwt.sign(
    {
      data: this._id,
    },
    process.env.JWT_SEC,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
module.exports = mongoose.model("ChatSchema", ChatSchema);
