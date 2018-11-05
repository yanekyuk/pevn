const {User, Post, Comment, Community, Subscription, Like, Save} = require('../models')

module.exports = {
  async index (req, res) {
    await User.findAll({
      attributes: ['id', 'username']
    }).then(users => {
      res.status(200).send(users)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcılar bulunamadı.',
        error: error
      })
    })
  },
  async show (req, res) {
    await User.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Subscription, attributes: ['user_id'], as: 'followers' }],
      attributes: ['id', 'username', 'slug']
    }).then(user => {
      res.status(200).send(user)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı',
        error: error
      })
    })
  },
  async posts (req, res) {
    await Post.findAll({
      limit: req.query.limit,
      subQuery: false,
      order: [['created_at', 'DESC']],
      where: { user_id: req.params.id },
      attributes: ['id', 'title', 'type', 'created_at'],
      include: [
        { model: Comment, attributes: ['id'], as: 'comments' },
        { model: User, attributes: ['id', 'username'], as: 'user' },
        { model: Like, attributes: ['id', 'user_id'], as: 'likes' },
        { model: Community, attributes: ['id', 'title', 'slug'], as: 'community' }
      ]
    }).then(posts => {
      res.status(200).send(posts)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcının içerikleri bulunamadı.',
        error: error
      })
    })
  },
  async comments (req, res) {
    await Comment.findAll({
      where: { user_id: req.params.id },
      include: [
        { model: Comment, attributes: ['id'], as: 'comments' },
        { model: Comment, attributes: ['id', 'body'], as: 'commentee' },
        { model: Post, attributes: ['id', 'title'], as: 'post' }
      ],
      attributes: ['id', 'body', 'commentable_type', 'created_at', 'updated_at']
    }).then(comments => {
      res.status(200).send(comments)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcının yorumları bulunamadı.',
        error: error
      })
    })
  },
  async subscriptions (req, res) {
    await Subscription.findAll({
      where: { user_id: req.params.id },
      attributes: ['id', 'subscribable_type', 'subscribable_id']
    }).then(subscriptions => {
      res.status(200).send(subscriptions)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcının takip ettikleri bulunamadı.',
        error: error
      })
    })
  },
  async likes (req, res) {
    await Like.findAll({
      where: { user_id: req.params.id },
      attributes: ['id', 'likeable_type', 'likeable_id']
    }).then(likes => {
      res.status(200).send(likes)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcının beğenileri bulunamadı.',
        error: error
      })
    })
  },
  async saves (req, res) {
    await Save.findAll({
      where: { user_id: req.params.id },
      attributes: ['id', 'saveable_type', 'saveable_id']
    }).then(saves => {
      res.status(200).send(saves)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcının kaydettikleri bulunamadı.',
        error: error
      })
    })
  },
  async communities (req, res) {
    await User.findOne({ where: { id: req.params.id } }).then(async user => {
      await user.getCommunities().then(communities => {
        res.status(200).send(communities)
      }).catch(error => {
        res.status(404).send({
          message: 'Kullanıcının moderatör olduğu topluluklar bulunamadı.', error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı.', error: error
      })
    })
  },
  async home (req, res) {
    try {
      res.send('<h5>Hiçerik API</h5>')
    } catch (err) {
      res.status(500).send({
        error: err
      })
    }
  }
}
