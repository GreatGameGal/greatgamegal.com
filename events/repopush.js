const {execSync} = require("child_process");
const secsToShutdown = 30;

module.exports = {
  run: function (e) {
    switch (e.repo.full_name) {
      case this.config.nodeRepo:
        // Call shutdown event to prepare for shutdown (ie log users out, save data, etc).
        this.eventHandler.emit("shutdown", {time: secsToShutdown, reason: "update"})
        // Exit process after a short wait
        setTimeout(() => process.exit(5), secsToShutdown*10**3);
        break;

      case this.config.htmlRepo:
        console.log("Updating website from repo.");
        const commands = [
          "git fetch origin master",
          "git reset --hard origin/master",
          "git pull origin master --force",
          "yarn install",
          "yarn run build"
        ];
        for (const cmd of commands) {
          console.log(execSync(cmd, {cwd: `${this.baseDir}/static/build`}).toString());
        }
        console.log("Website update completed");
        break;

      default:
        console.warn("Repo updated was not recognized: " + e.repo.full_name);
        break;
    }
  },
  event: "repopush",
};
