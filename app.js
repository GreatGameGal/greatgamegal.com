const http = require("http");
const https = require("https");

const fs = require("fs");
const express = require("express");
const { port, key, cert } = require("./config/config.js");
const app = express();

const server =
  key && cert
    ? https.createServer(
        {
          key: key,
          cert: cert
        },
        app
      )
    : http.createServer(app);

app.use("/", express.static("./public_html/"));

server.listen(port, () => {
  console.log(`App is now listening on ${port}`);
});
