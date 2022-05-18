const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  friendOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSchema",
  },
  friendName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSchema",
  },
  chating: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatSchema",
      },
      text: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("FriendSchema", FriendSchema);
