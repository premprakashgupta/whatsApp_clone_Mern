const mongoose = require("mongoose");

exports.dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("mongo connected"))
    .catch((err) => console.log(err));
};
