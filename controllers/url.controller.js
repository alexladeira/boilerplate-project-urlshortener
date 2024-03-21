const dns = require("node:dns");
const dnsPromises = dns.promises;

const Url = require("../models/url.model");

const redirect = async (req, res) => {
  const result = await Url.findOne({
    short_url: req.params.short_url,
  }).exec();

  res.redirect(result.original_url);
};

const create = async (req, res) => {
  const url = new Url({
    original_url: req.newUrl,
    short_url: parseInt(Math.random() * 1000000),
  });
  await url.save();
  return res.json(url);
};

const validate = async (req, res, next) => {
  try {
    await dnsPromises.lookup(new URL(req.body.url).hostname);
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  req.newUrl = req.body.url;
  next();
};

module.exports = {
  create,
  redirect,
  validate,
};
