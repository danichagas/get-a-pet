const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req, res, next) => {

  if(!req.headers.authorization) {
    return res.status(401).json({ message: 'Acesso neagado!' })
  }

  const token = getToken(req)

  if(!token) {
    return res.status(401).json({ message: 'Acesso neagado!' })
  }

  try {
    const verified = jwt.verify(token, 'nossosecret')
    req.user = verified
  } catch(err) {
    return res.status(400).json({ message: 'Toke inválido!' })
  }
}

module.exports = checkToken