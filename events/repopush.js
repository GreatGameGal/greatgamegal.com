module.exports = {
  run: function () {
    // Log that the webserver is restarting.
    console.log("Webserver restarting due to github repoupdate.")
    // Prepare for shutdown (ie log users out, save data, etc).

    // Exit process after a short wait
    setTimeout(() => process.exit(5), 1000);
  },
  event: "repopush",
};
