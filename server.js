require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
