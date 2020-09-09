const crypto = require("crypto");

module.exports = function (req, res, next) {
  console.log("Got here");
  req.on("data", (chunk) => {
    if (
      req.headers["x-hub-signature"] ==
      "sha1=" +
        crypto
          .createHmac("sha1", this.config.github_secret)
          .update(chunk.toString())
          .digest("hex")
    )
      this.eventHandler.emit("repoupdate", {});
  });
};
