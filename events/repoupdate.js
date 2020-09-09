module.exports = {
  run: function () {
    // Prepare for shutdown (ie log users out, save data, etc).

    // Exit process after a short wait
    setTimeout(() => process.exit(5), 1000);
  },
  event: "repoupdate",
};
