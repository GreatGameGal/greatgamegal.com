const http = require("http");
const https = require("https");

const fs = require("fs");
const express = require("express");
const { port, keyPath, certPath, chainPath } = require("./config/config.js");
const app = express();

const server =
  fs.existsSync(keyPath) && fs.existsSync(certPath) && fs.existsSync(chainPath)
    ? https.createServer(
        {
          "key": fs.readFileSync(keyPath, "utf-8"),
          "cert": fs.readFileSync(certPath, "utf-8"),
          "ca": fs.readFileSync(chainPath, "utf-8")
        },
        app
      )
    : http.createServer(app);

app.use("/", express.static("./public_html/"));

server.listen(port, () => {
  console.log(`App is now listening on ${port}`);
});
