require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dns = require("node:dns");

const app = express();
const dnsPromises = dns.promises;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGODB_URI);

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});
const Url = mongoose.model("Url", urlSchema);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app
  .route("/api/shorturl/:short_url?")
  .get(async (req, res) => {
    const result = await Url.findOne({
      short_url: req.params.short_url,
    }).exec();

    res.redirect(result.original_url);
  })
  .post(
    async (req, res, next) => {
      try {
        await dnsPromises.lookup(
          req.body.url.replace("http://www.", "").replace("https://www.", ""),
          { all: true }
        );
      } catch (err) {
        return res.json({ error: "invalid url" });
      }

      req.newUrl = req.body.url;
      next();
    },
    async (req, res) => {
      const url = new Url({
        original_url: req.newUrl,
        short_url: parseInt(Math.random() * 1000000),
      });
      await url.save();
      return res.json(url);
    }
  );

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
