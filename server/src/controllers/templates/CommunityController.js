const {Community, CommunitySetting, Subscription, User} = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  async index (req, res) {
    await Community.findAll({
      attributes: ['id', 'slug', 'title']
    }).then(communities => {
      res.status(200).send(communities)
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluklar bulunamadı.',
        error: error
      })
    })
  },
  async show (req, res) {
    await Community.findOne({
      where: { slug: req.params.slug },
      attributes: ['id', 'slug', 'title', 'description', 'color', 'created_at'],
      include: [
        { model: Subscription, attributes: ['user_id'], as: 'subscriptions' },
        { model: User, attributes: ['id', 'username'], as: 'moderators' },
        { model: CommunitySetting, as: 'settings', attributes: ['allow_link', 'allow_post', 'allow_image'] }
      ]
    }).then(async community => {
      res.status(200).send(community)
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    const {title, slug, description, color} = req.body
    await Community.create({
      title: title, slug: slug, description: description, color: color
    }).then(async community => {
      await community.setModerators([auth.id]).then(() => {
        res.status(101)
      }).catch(error => { res.status(424).send({ message: 'Moderatör oluşturulamadı.', error: error }) })
      await CommunitySetting.create({
        community_id: community.id, allow_link: req.body.allow_link, allow_post: req.body.allow_post, allow_image: req.body.allow_image
      }).catch(error => { res.status(424).send({ message: 'Ayarlar oluşturulamadı.', error: error }) })
      res.status(201).send(community)
    }).catch(error => {
      res.status(424).send({
        message: 'Topluluk oluşturulamadı.',
        error: error
      })
    })
  },
  async update (req, res) {
    const {title, slug, description, color} = req.body
    await Community.findOne({ where: { slug: req.params.slug } }).then(async community => {
      community.update({ title: title, slug: slug, description: description, color: color })
      await community.getSettings().then(settings => {
        settings.update({ allow_link: req.body.allow_link, allow_post: req.body.allow_post, allow_image: req.body.allow_image })
      }).catch(error => {
        res.status(424).send({ message: 'Topluluk ayarları değiştirilemedi!', error: error })
      })
      res.status(201).send(community)
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Community.findOne({ where: { slug: req.params.slug } }).then(community => {
      community.destroy().then(community => {
        res.status(204).send(community)
      })
    }).catch(error => {
      res.status(424).send({
        message: 'Topluluk kaldırılamadı.',
        error: error
      })
    })
  }
}
