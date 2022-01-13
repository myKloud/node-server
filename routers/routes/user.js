const express = require("express");

const {
  createNewUser,
  getUserDataById,
  generatePGP,
} = require("../controllers/user");

const userRouter = express.Router();

userRouter.post("/", createNewUser);
userRouter.get("/:id", getUserDataById);
userRouter.get("/pgp/generate", generatePGP);
module.exports = userRouter;
