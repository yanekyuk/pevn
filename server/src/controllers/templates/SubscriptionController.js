const {Subscription} = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  async index (req, res) {
    await Subscription.findAll({
      where: {
        subscribable_id: req.params.id,
        subscribable_type: req.params.type
      },
      attributes: ['id', 'subscribable_type', 'subscribable_id', 'user_id']
    }).then(subs => {
      res.status(200).send(subs)
    }).catch(error => {
      res.status(404).send({
        message: 'Takipler bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Subscription.create({
      user_id: auth.id,
      subscribable_id: req.body.subscribable_id,
      subscribable_type: req.body.subscribable_type
    }).then(sub => {
      res.status(201).send(sub)
    }).catch(error => {
      res.status(424).send({
        message: 'Takip edilemedi.',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Subscription.findById(req.params.id).then(sub => {
      sub.destroy()
      res.status(204).send(sub)
    }).catch(error => {
      res.status(404).send({
        message: 'Takip bulunamadı.',
        error: error
      })
    })
  }
}
