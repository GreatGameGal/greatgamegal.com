const crypto = require("crypto");

module.exports = function (req, res, next) {
  console.log(req.headers["x-hub-signature"]);
  console.log(
    "sha1=" +
      crypto
        .createHmac("sha1", this.config.github_secret)
        .update(JSON.stringify(req.body))
        .digest("hex")
  );
  if (
    req.headers["x-hub-signature"] ==
    "sha1=" +
      crypto
        .createHmac("sha1", this.config.github_secret)
        .update(JSON.stringify(req.body))
        .digest("hex")
  )
    this.eventHandler.emit("repoupdate", {});
};
