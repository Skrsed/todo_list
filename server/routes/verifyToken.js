const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const authorization = req.header('Authorization')
  if (!authorization) return res.status(401).send('Authorization header not provided')

  const token = authorization.slice(7)
  if (!token) return res.status(401).send('Access token is empty')

  try {
    const verified = jwt.verify(token, process.env.SECRET_JWT_TOKEN)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}
