import { Server } from "../Server";

import { execSync } from "child_process";
const secsToShutdown = 30;

export function run (this: Server, e: {
  // TODO: This should really be more in-depth and based on the github API.
  repo: {
    name?: string,
    full_name?: string
  },
}) {
  switch (e.repo.name) {
    case process.env.NODE_REPO: {
      // Call shutdown event to prepare for shutdown (ie log users out, save data, etc).
      this.eventHandler.emit("shutdown", {
        time: secsToShutdown,
        reason: "update",
      });
      // Exit process after a short wait
      setTimeout(() => process.exit(5), secsToShutdown * 10 ** 3);
    } break;

    case process.env.HTML_REPO:
      console.log("Updating website from repo.");
      for (const cmd of [
        [
          "git",
          "fetch",
          "origin",
          "master",
        ],
        [
          "git",
          "reset",
          "--hard",
          "origin/master",
        ],
        [
          "git",
          "pull",
          "origin",
          "master",
          "--force",
        ],
        [ "bun", "install" ],
        [
          "bun",
          "run",
          "build",
        ],
      ]) {
        console.log(Bun.spawnSync(cmd, {
          cwd: `${this.basedir}/static`,
          env: process.env,
        }).toString());
      }

      console.log("Website update completed");
      break;

    default:
      console.warn("Repo updated was not recognized: " + e.repo.full_name);
      break;
  }
}
export const event = "repopush";
