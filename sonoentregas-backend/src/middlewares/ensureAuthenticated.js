const { verify } = require('jsonwebtoken')
const { jwt } = require('../databases/MSSQL/connections/config')

module.exports = {
  ensureAuthenticated(req, res, next) {
    const authHead = req.headers.authorization

    if (!authHead) {
      return res.status(401).json('JWT não informado!')
    }

    try {
      const [, token] = authHead.split(' ')

      const { sub: user_id } = verify(token, jwt.secret)

      req['user'] = {
        id: Number(user_id)
      }

      next()
    } catch (error) {
      console.log(error)
      return res.status(401).json('JWT token inválido!')
    }
  } 
}