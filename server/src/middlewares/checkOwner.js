const jwt = require('jsonwebtoken')
const models = require('../models')

module.exports = {
  async user (req, res, next) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await models.User.findById(req.params.id).then(user => {
      if (auth.role_id >= 1 || user.id === auth.id) {
        next()
      } else {
        res.status(403).send({
          message: 'Yetersiz yetki.'
        })
      }
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı.',
        location: 'checkOwner',
        error: error
      })
    })
  }
}
