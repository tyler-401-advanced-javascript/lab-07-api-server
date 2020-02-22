function logger(req, res, next) {
  console.log(`********  PATH:  '${req.path}'     METHOD:  '${req.method}'     REQUEST TIME:  '${req.requestTime}'`);
  next()
}

//logger middleware.
module.exports = logger;