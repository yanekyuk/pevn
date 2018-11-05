const {Save, Post, Tag, Comment, User, Like, Community} = require('../models')
const jwt = require('jsonwebtoken')

module.exports = {
  async posts (req, res) {
    await Save.findAll({
      where: { user_id: req.params.id, saveable_type: 'post' },
      limit: req.query.page ? 20 : null,
      offset: req.query.page ? req.query.page * 20 : null,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'user_id', 'saveable_id', 'created_at'],
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
    }).then(saves => {
      res.status(200).send(saves.map(save => { return save.post }))
    }).catch(error => {
      res.status(404).send({
        message: 'Kaydedilenler bulunamadı.',
        error: error
      })
    })
  },
  async comments (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Save.findAll({
      where: { user_id: auth.id, saveable_type: 'comment' },
      limit: req.query.page ? 20 : null,
      offset: req.query.page ? req.query.page * 20 : null,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'user_id', 'saveable_id', 'created_at'],
      include: [{
        model: Comment,
        attributes: [ 'id', 'user_id', 'body', 'created_at' ],
        as: 'comment',
        include: [
          { model: Comment, attributes: ['id'], as: 'comments' },
          { model: User, attributes: ['id', 'username'], as: 'user' },
          { model: Like, attributes: ['id', 'user_id'], as: 'likes' },
          { model: Save, attributes: ['id', 'user_id'], as: 'saves' },
          { model: Post, attributes: ['id', 'title'], as: 'post' }]
      }]
    }).then(saves => {
      res.status(200).send(saves.map(save => { return save.comment }))
    }).catch(error => {
      res.status(404).send({
        message: 'Kaydedilenler bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Save.create({
      user_id: auth.id,
      saveable_id: req.body.saveable_id,
      saveable_type: req.body.saveable_type
    }).then(save => {
      res.status(201).send(save)
    }).catch(error => {
      res.status(424).send({
        message: 'Beğeni oluşturulamadı.',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Save.findById(req.params.id).then(save => {
      save.destroy()
      res.status(204).send(save)
    }).catch(error => {
      res.status(424).send({
        message: 'Beğeni kaldırılamadı.',
        error: error
      })
    })
  }
}
