module.exports = {
  run: function (e) {
    console.log(`Shutting down for ${e.reason} in ${e.time} seconds.`)
  },
  event: "shutdown"
}