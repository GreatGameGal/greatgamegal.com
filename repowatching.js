const { GitWatcher } = require("git-repo-watch");
const watcher = new GitWatcher();

module.exports = watcher.watch({
  path: "./",
  branch: "master",
});
