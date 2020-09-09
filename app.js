const https = require("https");
const fs = require("fs");
const express = require("express");
const { EventEmitter } = require("events");

const repoWatcher = require("./repowatching.js");
const { recursiveFileParse } = require("./functions.js");

const { port, keyPath, certPath } = require("./config/config.js");

class Site {
  constructor() {
    this.events = new EventEmitter();
    this.events.on("repoupdate", (e) => this.repoUpdate(e));
    // Create app
    this.app = express();
    // Create server, HTTPS requires key and cert.
    this.server = https.createServer(
      {
        key: fs.readFileSync(keyPath, "utf-8"),
        cert: fs.readFileSync(certPath, "utf-8"),
      },
      this.app
    );
    this.setMiddleWare();
    this.setRoutes();
    this.server.listen(port, () => {
      console.log(`App is now listening on ${port}`);
    });
  }

  setMiddleWare() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
  }

  setRoutes() {
    let routes = recursiveFileParse("/routes");
    for (let route of routes) {
      let splitPath = route.path.split("/");
      switch (splitPath[splitPath.length - 1].split(".")[0]) {
        case "get":
        case "post":
        case "put":
        case "patch":
        case "delete":
          if (typeof route.content == "function")
            this.app[splitPath[splitPath.length - 1].split(".")[0]](
              "/" + splitPath.slice(2, splitPath.length - 1).join("/"),
              route.content.bind(this)
            );
          else
            console.warn(
              `The file ${route.path} does not have a function associated to it, be sure to module.exports = your function.`
            );
          break;

        default:
          console.warn(
            `The file ${route.path} is of an unsupported type, it should be named get.js, post.js, put.js, patch.js, or delete.js.`
          );
          break;
      }
    }
    this.app.use(
      "/",
      express.static(__dirname + "/public_html/", {
        dotfiles: "ignore",
        extensions: ["html", "htm", "js", "css"],
      })
    );
  }

  repoUpdate() {
    // Prepare for shutdown.

    // Exit process after a short wait
    setTimeout(() => process.exit(5), 1000);
  }
}

new Site();

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
