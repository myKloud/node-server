const express = require("express");

const {latestEvent ,emailContact ,mailSettings,labels,settings ,features , userAddress , userCookies , userSalts , userinfo , info, checkLogin } = require("../../controllers/auth/credentials");
const credentialsRouter = express.Router();
credentialsRouter.post("/api/auth", checkLogin);
credentialsRouter.post("/api/auth/info", info);
credentialsRouter.get("/api/users", userinfo);
credentialsRouter.get("/api/keys/salts", userSalts);
credentialsRouter.post("/api/auth/cookies", userCookies);
credentialsRouter.get("/api/addresses", userAddress);
credentialsRouter.get("/api/core/v4/features", features);
credentialsRouter.get("/api/settings", settings);
credentialsRouter.get("/api/v4/labels", labels);
credentialsRouter.get("/api/mail/v4/settings", mailSettings);
credentialsRouter.get("/api/contacts/v4/contacts/emails", emailContact);
credentialsRouter.get("/api/v4/events/latest", latestEvent);
















module.exports = credentialsRouter;
