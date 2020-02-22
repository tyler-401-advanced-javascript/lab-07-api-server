function errorHandler(error, req, res, next) {
  res.status(406).send(error + '  :  Unacceptable request. Sorry. ..Not Sorry.')
}


module.exports = errorHandler;