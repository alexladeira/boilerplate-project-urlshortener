const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const urlRoutes = require("./routes/url.route");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use("/api", urlRoutes);

module.exports = app;
