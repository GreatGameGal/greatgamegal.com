const {execSync} = require("child_process");

module.exports = {
  run: function (e) {
    switch (e.repo.full_name) {
      case this.config.nodeRepo:
        // Log that the webserver is restarting.
        console.log("Webserver restarting due to github repoupdate.");
        // Prepare for shutdown (ie log users out, save data, etc).

        // Exit process after a short wait
        setTimeout(() => process.exit(5), 1000);
        break;

      case this.config.htmlRepo:
        console.log("Updating website from repo.");
        const commands = [
          `pwd ${this.baseDir}/public_html`,
          "git fetch origin master",
          "git reset --hard origin/master",
          "git pull origin master --force"
        ];
        for (const cmd of commands) {
          console.log(execSync(cmd).toString());
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
