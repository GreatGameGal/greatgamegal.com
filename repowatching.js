const { GitWatcher } = require("git-repo-watch");
const watcher = new GitWatcher();

watcher.watch({
  path: "./",
  branch: "master",
});

module.exports = watcher;