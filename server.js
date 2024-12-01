const express = require("express");
require("dotenv").config();

const app = express();

require("./subscribe");
require("./publish");

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
