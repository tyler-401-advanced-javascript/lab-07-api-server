function timeStamp(req, res, next) {
  req.requestTime = Date().toLocaleString();
  next();
}

module.exports = timeStamp;