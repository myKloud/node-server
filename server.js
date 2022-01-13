const express = require("express");
const cors = require("cors");
const db = require("./db/db");
const userModel = require("./db/models/user");
//

const credentialsRouter = require("./routers/routes/auth/credentials");
const userRouter = require("./routers/routes/user");

const app = express();

//routers

//built-in middlewares
app.use(express.json());

//third-party middleware
app.use(cors());

//app routers

app.use("/", credentialsRouter);
app.use("/user", userRouter);

// Set templating engine
app.set("view engine", "ejs");

// Navigation
app.get("", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server On ${PORT}`);
});
