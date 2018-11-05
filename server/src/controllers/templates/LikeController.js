const {Like, Post, Comment, User, Save, Tag, Community} = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  async posts (req, res) {
    await Like.findAll({
      where: { user_id: req.params.id, likeable_type: 'post' },
      limit: req.query.page ? 20 : null,
      offset: req.query.page ? req.query.page * 20 : null,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'user_id', 'likeable_id', 'created_at'],
      include: [{
        model: Post,
        attributes: [ 'id', 'user_id', 'community_id', 'title', 'type', 'created_at' ],
        as: 'post',
        include: [
          { model: Comment, attributes: ['id'], as: 'comments' },
          { model: User, attributes: ['id', 'username'], as: 'user' },
          { model: Like, attributes: ['id', 'user_id'], as: 'likes' },
          { model: Save, attributes: ['id', 'user_id'], as: 'saves' },
          { model: Tag, attributes: ['title', 'slug'], as: 'tags', through: { attributes: [] } },
          { model: Community, attributes: ['id', 'title', 'slug'], as: 'community' }]
      }]
    }).then(likes => {
      res.status(200).send(likes.map(like => { return like.post }))
    }).catch(error => {
      res.status(404).send({
        message: 'Beğenilenler bulunamadı.',
        error: error
      })
    })
  },
  async index (req, res) {
    await Like.findAll({
      attributes: ['id', 'user_id'],
      where: {
        likeable_id: req.params.id,
        likeable_type: req.params.type
      }
    }).then(likes => {
      res.status(200).send(likes)
    }).catch(error => {
      res.status(404).send({
        message: 'Beğeniler bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Like.create({
      user_id: auth.id,
      likeable_id: req.body.likeable_id,
      likeable_type: req.body.likeable_type
    }).then(like => {
      res.status(201).send(like)
    }).catch(error => {
      res.status(424).send({
        message: 'Beğenilemedi.',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Like.findById(req.params.id).then(like => {
      like.destroy()
      res.status(204).send(like)
    }).catch(error => {
      res.status(424).send({
        message: 'Beğeni kaldırılamadı.',
        error: error
      })
    })
  }
}
