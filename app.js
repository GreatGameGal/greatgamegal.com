const https = require("https");

const fs = require("fs");
const express = require("express");
const { port, keyPath, certPath, chainPath } = require("./config/config.js");
const app = express();

app.use("/", express.static(__dirname + "/public_html/"));

https
  .createServer(
    {
      key: fs.readFileSync(keyPath, "utf-8"),
      cert: fs.readFileSync(certPath, "utf-8")
    },
    app
  )
  .listen(port, () => {
    console.log(`App is now listening on ${port}`);
  });
