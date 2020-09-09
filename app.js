const https = require("https");
const fs = require("fs");
const express = require("express");
const { EventEmitter } = require("events");

const { recursiveFileParse } = require("./functions.js");

class Site {
  constructor() {
    this.config = require("./config/config.js");
    // Secret config only exists so I can stream and show regular config on stream.
    if (fs.existsSync("./config/secret_config.js")) {
      this.config = Object.assign(this.config, require("./config/secret_config.js"));
    }
    this.events = [];
    this.setupEventsAndListeners();
    // Pull necessary variables from config.
    const {keyPath, certPath, port} = this.config;
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

  setupEventsAndListeners() {
    this.eventHandler = new EventEmitter();
    for (let event of this.events) {
      this.eventHandler.removeListener(event.content.type, event.content.run);
    }
    this.events = recursiveFileParse("/events");
    for(let eventFile of this.events) {
      const event = eventFile.content;
      if (typeof event.run === "function") {
        event.run = event.run.bind(this);
        this.eventHandler.addListener(event.event, event.run);
      } else console.warn (`The run of the event file ${eventFile.path} is not valid, it must be a function.`)
    }
  }

  setMiddleWare() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
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
}

// Sets up the site.
new Site();

// Creates HTTP server to redirect to HTTPS server.
const http = express();
http.get("*", (req, res) => {
  res.redirect("https://" + req.headers.host + req.url);
});
http.listen(80);

