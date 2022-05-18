const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const MainRoutes = require("./routes/MainRoutes");
const path = require("path");
const { dbConnection } = require("./db/db_connection");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// db connection ------------------------------------------------

dbConnection();

// db connection ------------------------------------------------

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
let users = [];
if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    })
  );
} else {
  app.use(cors());
}

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server);
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
// get connected user
io.on("connection", (socket) => {
  console.log("connected user");
  socket.on("addUser", (data) => {
    addUser(data, socket.id);
    console.log("new user", users);
    io.emit("allUser", users);
  });

  // send message

  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const user = users.find((user) => user.userId === recieverId);

    if (typeof user !== "undefined") {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        recieverId,
        text,
      });
    }
  });
  // disconnect
  socket.on("disconnect", () => {
    console.log("disconnect");
    removeUser(socket.id);
    console.log("new user", users);
    io.emit("allUser", users);
  });
});
// app.get("/", (req, res) => {
//   res.send("active");
// });

app.use("/api/v2", MainRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

server.listen("4000", () => {
  console.log("server connected");
});
