const fs = require("fs");

module.exports = {
  port: 80,
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem")
}