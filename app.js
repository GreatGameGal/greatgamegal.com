const https = require("https");

const fs = require("fs");
const express = require("express");
const { port, keyPath, certPath, chainPath } = require("./config/config.js");
const app = express();
const repoWatcher = require("./repowatching.js");

app.use("/", express.static(__dirname + "/public_html/"));

// Create HTTPS server.
https
  .createServer(
    {
      key: fs.readFileSync(keyPath, "utf-8"),
      cert: fs.readFileSync(certPath, "utf-8"),
    },
    app
  )
  .listen(port, () => {
    console.log(`App is now listening on ${port}`);
  });

// Creates HTTP server to redirect to HTTPS server.
const http = express();
http.get("*", (req, res) => {
  res.redirect("https://" + req.headers.host + req.url);
});
http.listen(80);


repoWatcher.result$.subscribe((result) => {
  if (result.changed === true) {
    process.exit(5);
  }
});