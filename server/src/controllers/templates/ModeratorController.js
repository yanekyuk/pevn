const {Community, User} = require('../models')

module.exports = {
  async index (req, res) {
    await Community.findOne({ where: { slug: req.params.slug } }).then(async community => {
      await community.getModerators({ attributes: ['id', 'username'] }).then(moderators => {
        res.status(200).send(moderators)
      }).catch(error => {
        res.status(404).send({
          message: 'Moderatörler bulunamadı.', error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    await Community.findOne({ where: { slug: req.params.slug }, include: [{ model: User, as: 'moderators' }] }).then(async community => {
      await community.setModerators(req.body.users).then(() => {
        res.status(201).send({
          message: 'Moderatör başarıyla eklendi.', community: community
        })
      }).catch(error => {
        res.status(424).send({
          message: 'Moderatör eklenemedi.', error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.', error: error
      })
    })
  },
  async delete (req, res) {
    await Community.findOne({ where: { slug: req.params.slug }, include: [{ model: User, as: 'moderators' }] }).then(async community => {
      await community.removeModerators([req.params.id]).then(() => {
        res.status(204).send({
          message: 'Moderatör kaldırıldı.', community: community
        })
      }).catch(error => {
        res.status(424).send({
          message: 'Moderatör kaldırılamadı.', error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.', error: error
      })
    })
  }
}
