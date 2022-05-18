const { Auth } = require("../auth/auth");
const {
  GetMessage,
  InsertMessage,
  DeleteMessage,
} = require("../controller/ChatController");
const {
  UserCreation,
  UserLogin,
  Profile,
  FriendMaking,
  Logout,
  DeleteUser,
  GetAllUser,
  FindUser,
} = require("../controller/UserController");

const Router = require("express").Router();

Router.route("/create").post(UserCreation);
Router.route("/login").post(UserLogin);
Router.route("/allUser").get(Auth, GetAllUser);
Router.route("/friendMaking/:id").put(Auth, FriendMaking);
Router.route("/profile").get(Auth, Profile);
Router.route("/message/:id").get(Auth, GetMessage);
Router.route("/insertMessage/:id").put(Auth, InsertMessage);
Router.route("/deleteUser/:id").delete(Auth, DeleteUser);
Router.route("/findUser").post(FindUser);
Router.route("/logout").get(Auth, Logout);

module.exports = Router;
