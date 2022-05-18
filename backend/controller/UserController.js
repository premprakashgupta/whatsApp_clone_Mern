const ChatSchema = require("../models/Chat_model");
const cookieImplement = require("../utiles/cookieImplementation");
exports.GetAllUser = async (req, res) => {
  let array = [];
  req.userData.friends.forEach((i) => {
    array.push(i);
  });

  try {
    const data = await ChatSchema.find({
      _id: { $nin: [...array, req.userData._id] },
    });
    res.status(200).json({
      data,
      error: false,
      msg: "All User found..",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.UserCreation = async (req, res) => {
  try {
    const data = await ChatSchema.create(req.body);
    cookieImplement(data, 200, res, "user create successfully");
  } catch (error) {
    console.log(error);
  }
};
exports.UserLogin = async (req, res) => {
  try {
    const data = await ChatSchema.findOne({ mobile: req.body.mobile }).populate(
      "friends"
    );

    if (!data) {
      return res.status(401).json({
        data,
        error: true,
        msg: "User not found",
      });
    }
    cookieImplement(data, 200, res, "Login successfully");
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};
exports.FriendMaking = async (req, res) => {
  try {
    const data = await ChatSchema.findById(req.params.id);

    let indicator1 = false;
    let indicator2 = false;
    // inser in friend array of my side---------------------------------------------
    req.userData.friends.forEach((i) => {
      if (i.toString() === req.params.id.toString()) {
        indicator1 = true;
      }
    });
    if (!indicator1) {
      req.userData.friends.push(data);
      await req.userData.save();
    }

    // insert in friend array of other side-------------------------------------------
    data.friends.forEach((i) => {
      if (i.toString() === req.userData.id.toString()) {
        indicator2 = true;
      }
    });

    if (!indicator2) {
      data.friends.push(req.userData);
      await data.save();
    }

    res.status(200).json({
      data,
      error: false,
      msg: "Friend Added successfully",
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};
exports.Profile = async (req, res) => {
  res.status(200).json({
    msg: "profile found",
  });
};
exports.Logout = async (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    req.userData.last_seen = Date.now();
    await req.userData.save();
    res.status(200).cookie("token", null, options).json({
      msg: "Logout",
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};
exports.DeleteUser = async (req, res) => {
  try {
    req.userData.friends = req.userData.friends.filter(
      (i) => i.toString() !== req.params.id.toString()
    );
    (arr2 = [req.params.id.toString(), req.userData._id.toString()]),
      (req.userData.chating = req.userData.chating.filter(
        (item) =>
          !arr2.includes(item.senderId.toString()) ||
          !arr2.includes(item.recieverId.toString())
      ));
    await req.userData.save();
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
exports.FindUser = async (req, res) => {
  try {
    const data = await ChatSchema.find({ mobile: req.body.mobile }).count();
    res.status(200).json({
      userAvailability: data,
    });
  } catch (error) {
    res.status(402).json({
      msg: error.message,
    });
  }
};
