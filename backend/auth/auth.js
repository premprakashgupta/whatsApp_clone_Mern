const jwt = require("jsonwebtoken");
const Chat_model = require("../models/Chat_model");
exports.Auth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).json({
        msg: "Login Again",
      });
    }
    const verify = jwt.verify(token, process.env.JWT_SEC);

    const data = await Chat_model.findById(verify.data);

    req.userData = data;
    next();
  } catch (error) {
    console.log(error);
  }
};
