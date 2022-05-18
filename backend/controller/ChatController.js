const ChatSchema = require("../models/Chat_model");
exports.GetMessage = async (req, res) => {
  try {
    let chating = [];
    req.userData.chating.forEach((i) => {
      if (
        (i.senderId.toString() === req.params.id.toString() &&
          i.recieverId.toString() === req.userData._id.toString()) ||
        (i.senderId.toString() === req.userData._id.toString() &&
          i.recieverId.toString() === req.params.id.toString())
      ) {
        chating.push(i);
      }
    });
    res.status(200).json({
      data: chating,
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};
exports.InsertMessage = async (req, res) => {
  try {
    const data = await ChatSchema.findById(req.params.id);
    if (!req.userData.friends.includes(req.params.id)) {
      req.userData.friends.push(data);
    }
    if (!data.friends.includes(req.userData._id)) {
      data.friends.push(req.userData);
    }
    req.userData.chating.push({
      senderId: req.userData._id,
      text: req.body.message,
      recieverId: data._id,
    });
    await req.userData.save();
    data.chating.push({
      senderId: req.userData._id,
      text: req.body.message,
      recieverId: data._id,
    });

    await data.save();

    res.status(200).json({
      data: req.userData,
      error: false,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};
