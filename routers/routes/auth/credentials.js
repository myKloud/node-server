const express = require("express");

const {userSalts , userinfo , info, checkLogin } = require("../../controllers/auth/credentials");
const credentialsRouter = express.Router();
credentialsRouter.post("/api/auth", checkLogin);
credentialsRouter.post("/api/auth/info", info);
credentialsRouter.get("/api/users", userinfo);
credentialsRouter.get("/api/keys/salts", userSalts);


module.exports = credentialsRouter;
