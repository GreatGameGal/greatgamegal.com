const { port } = require("./config.js");
const express = require("express");
const app = express();

app.use("/", express.static("./public_html/"))

app.listen(port, () => {
  console.log(`App is now listening on ${port}`);
});
