const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  salt: { type: String },
  verifier: { type: String },
});

const user = mongoose.model("User", userSchema);
module.exports = user;
