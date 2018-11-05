const jwt = require('jsonwebtoken')
// const models = require('../models')

module.exports = {
  async user (req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.role_id >= 0) {
        next()
      } else {
        res.status(403).send({
          message: 'Yetersiz yetki.'
        })
      }
    } catch (err) {
      res.status(404).send({
        message: 'Yetki bulunamadı.',
        error: err
      })
    }
  },
  async editor (req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.role_id >= 1) {
        next()
      } else {
        res.status(403).send({
          message: 'Yetersiz yetki.'
        })
      }
    } catch (err) {
      res.status(404).send({
        message: 'Yetki bulunamadı.',
        error: err
      })
    }
  },
  async admin (req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.role_id >= 2) {
        next()
      } else {
        res.status(403).send({
          message: 'Yetersiz yetki.'
        })
      }
    } catch (err) {
      res.status(404).send({
        message: 'Yetki bulunamadı.',
        error: err
      })
    }
  }
}
