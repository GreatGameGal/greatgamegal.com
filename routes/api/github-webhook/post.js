const crypto = require("crypto");

module.exports = function (req, res, next) {
  const hmac = crypto.createHmac("sha1", this.config.github_secret);
  const sig = "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");
  if (
    crypto.timingSafeEqual(
      Buffer.from(req.headers["x-hub-signature"]),
      Buffer.from(sig)
    )
  ) {
    switch (req.headers["x-github-event"]) {
      case "push":
        res.sendStatus(200);
        this.eventHandler.emit("repopush", {});
        break;

        default:
          console.warn("Unhandled github event: " + req.headers["x-github-event"]);
          break;
    }
  }
};
