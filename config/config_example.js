const fs = require("fs");

function fileIfExists(path) {
  return fs.existsSync(path)?fs.readFileSync(path):undefined;
}

module.exports = {
  port: 80,
  key: fileIfExists("./ssl/key.pem"),
  cert: fileIfExists("./ssl/cert.pem")
}