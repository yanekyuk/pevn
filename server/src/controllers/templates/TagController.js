const {Tag, CommentTag} = require('../models')

module.exports = {
  async index (req, res) {
    await Tag.findAll({
      where: { is_link: false },
      attributes: ['title', 'slug']
    }).then(tags => {
      res.status(200).send(tags)
    }).catch(error => {
      res.status(404).send({
        message: 'Etiketler bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    await Tag.create({ title: req.body.title }).then(tag => {
      res.status(201).send(tag)
    }).catch(error => {
      res.status(424).send({
        message: 'Etiket oluşturulamadı.', error: error
      })
    })
  },
  async update (req, res) {
    await Tag.findOne({ where: { slug: req.params.slug } }).then(tag => {
      tag.update({ title: req.body.title }).then(tag => {
        res.status(201).send(tag)
      }).catch(error => {
        res.status(424).send({ message: 'Etiket düzenlenemedi.', error: error })
      })
    }).catch(error => {
      res.status(404).send({ message: 'Etiket bulunamadı.', error: error })
    })
  },
  async show (req, res) {
    await Tag.findOne({
      where: { slug: req.params.slug },
      attributes: ['title', 'slug']
    }).then(tag => {
      res.status(200).send(tag)
    }).catch(error => {
      res.status(404).send({
        message: 'Etiket bulunamadı.',
        error: error
      })
    })
  },
  async deleteCommentTag (req, res) {
    await CommentTag.findOne({ where: { comment_id: req.query.comment_id, tag_slug: req.query.tag_slug } }).then(tag => {
      tag.destroy()
      res.status(204).send({ message: 'Etiket kaldırıldı.' })
    }).catch(error => { res.status(404).send({ message: 'Etiket bulunamadı.', error: error }) })
  },
  async delete (req, res) {
    await Tag.findById(req.params.id).then(tag => {
      tag.destroy()
      res.status(204).send(tag)
    }).catch(error => {
      res.status(424).send({
        message: 'Etiket kaldırılamadı.',
        error: error
      })
    })
  }
}
