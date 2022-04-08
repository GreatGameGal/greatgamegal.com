const crypto = require("crypto");

module.exports = function (req, res, next) {
  if (req.headers && req.body && req.headers["x-hub-signature"]) {
    const hmac = crypto.createHmac("sha1", this.config.github_secret);
    const sig = "sha1=" + hmac.update((req.body).toString()).digest("hex");
    if (
      crypto.timingSafeEqual(
        Buffer.from(req.headers["x-hub-signature"]),
        Buffer.from(sig)
      )
    ) {
      switch (req.headers["x-github-event"]) {
        case "push":
          res.sendStatus(200);
          this.eventHandler.emit("repo" + req.headers["x-github-event"], {
            req: req,
            repo: req.body.repository,
          });
          break;

        default:
          console.warn(
            "Unhandled github event: " + req.headers["x-github-event"]
          );
          break;
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};
