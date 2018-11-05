const {Comment, User, Like, Save, Tag} = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  async index (req, res) {
    const {type, id} = req.params
    const {sort, page} = req.query
    await Comment.findAll({
      attributes: ['id', 'body', 'user_id', 'created_at', 'updated_at'],
      where: {
        commentable_type: type,
        commentable_id: id
      },
      include: [
        { model: User, attributes: ['id', 'username', 'slug'], as: 'user' },
        { model: Save, attributes: ['id', 'user_id'], as: 'saves' },
        { model: Like, attributes: ['id', 'user_id'], as: 'likes' },
        { model: Tag, attributes: ['title', 'slug'], as: 'tags', through: { attributes: [] } },
        { model: Comment, attributes: ['id'], as: 'comments' }
      ]
    }).then(comments => {
      if (sort === 'top') {
        res.status(200).send(
          comments.sort((a, b) => { return b.likes.length - a.likes.length }).slice(20 * page, (page * 20) + 20)
        )
      } else if (sort === 'hot') {
        res.status(200).send(
          comments.sort((a, b) => { return b.comments.length - a.comments.length }).slice(20 * page, (page * 20) + 20)
        )
      } else if (sort === 'new') {
        res.status(200).send(
          comments.sort((a, b) => { return b.created_at - a.created_at }).slice(20 * page, (page * 20) + 20)
        )
      } else {
        res.status(200).send(comments)
      }
    }).catch(error => {
      res.status(404).send({
        message: 'Yorumlar bulunamadı.',
        error: error
      })
    })
  },
  async show (req, res) {
    await Comment.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'body', 'commentable_id', 'commentable_type', 'created_at'],
      include: [
        { model: User, attributes: ['id', 'username'], as: 'user' },
        { model: Comment, attributes: ['id', 'user_id'], as: 'comments' },
        { model: Tag, attributes: ['title', 'slug'], as: 'tags', through: { attributes: [] } },
        { model: Like, attributes: ['id', 'user_id'], as: 'likes' }
      ]
    }).then(comment => {
      res.send(comment)
    }).catch(error => {
      res.status(404).send({
        message: 'Yorum bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Comment.create({
      user_id: auth.id,
      body: req.body.body,
      commentable_id: req.body.commentable_id,
      commentable_type: req.body.commentable_type
    }).then(comment => {
      comment.setTags(req.body.tags).then(() => {
        res.status(201).send(comment)
      }).catch(error => { res.status(424).send({ message: 'Etiketlemede bir sıkıntı oldu.', error: error }) })
    }).catch(error => {
      res.status(424).send({
        message: 'Yorum yaratılamadı.',
        error: error
      })
    })
  },
  async update (req, res) {
    await Comment.findById(req.params.id).then(async comment => {
      await comment.update(req.body).then(comment => {
        comment.addTags(req.body.tags).then(comment => {
          res.status(201).send(comment)
        }).catch(error => { res.status(424).send({ message: 'Etiketlemede bir sıkıntı oldu.', error: error }) })
      }).catch(error => {
        res.status(424).send({
          message: 'Yorum düzenlenemedi.',
          error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Yorum bulunamadı',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Comment.findById(req.params.id).then(async comment => {
      await comment.destroy().then(response => {
        res.status(204).send(response)
      })
    }).catch(error => {
      res.status(424).send({
        error: 'Yorum kaldırılamadı. => ' + error
      })
    })
  }
}
