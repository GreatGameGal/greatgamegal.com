module.exports = function (req, res, next) {
  res.send("This worked?!");
  next();
}