const getToken =(req) => {
  const authReader = req.headers.authorization
  const token = authReader.split(' ')[1]

  return token
}
 module.exports = getToken