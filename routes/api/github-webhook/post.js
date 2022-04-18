const crypto = require("crypto");

module.exports = function (req, res) {
  if (req.headers && req.headers["x-hub-signature-256"]) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.once("close", () => {
      const sig =
        "sha256=" +
        crypto
          .createHmac("sha256", this.config.githubSecret)
          .update(data)
          .digest("hex");

      if (
        crypto.timingSafeEqual(
          Buffer.from(sig),
          Buffer.from(req.headers["x-hub-signature-256"])
        )
      ) {
        const body = JSON.parse(data);
        this.eventHandler.emit("repo" + req.headers["x-github-event"], {
          body,
          repo: body.repository,
        });

        res.sendStatus(200);
      }
      res.sendStatus(401);
    });
  } else
    res.sendStatus(401);

  res.end();
};
