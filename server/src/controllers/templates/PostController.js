const {Post, Tag, Comment, Community, User, Like, Save, Subscription} = require('../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const moment = require('moment')

module.exports = {
  async index (req, res) {
    var auth; var paranoid
    const { special, community, user, tag, sort, days, page } = req.query
    if (req.headers.authorization && user) {
      auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
      paranoid = auth.id.toString() !== user
    } else { paranoid = true }
    var likeModel = { model: Like, attributes: ['id', 'user_id'], as: 'likes' }
    var commentModel = { model: Comment, attributes: ['id'], as: 'comments' }
    var tagModel = { model: Tag, attributes: ['title', 'slug'], as: 'tags', through: { attributes: [] } }
    if (sort === 'top') {
      likeModel.where = { created_at: {[Op.gte]: moment().subtract(days, 'days').toDate()} }
    } else if (sort === 'hot') {
      commentModel.where = { created_at: {[Op.gte]: moment().subtract(days, 'days').toDate()} }
    } else if (tag) {
      tagModel.through = { where: { tag_slug: tag } }
      tagModel.required = tag
    }
    await Post.findAll({
      attributes: [ 'id', 'user_id', 'community_id', 'title', 'type', 'created_at', 'deleted_at' ],
      paranoid: paranoid,
      where: {
        community_id: community || { [Op.gt]: 0 },
        user_id: user || { [Op.gt]: 0 }
      },
      include: [
        { model: User, attributes: ['id', 'username', 'slug'], as: 'user' },
        { model: Save, attributes: ['id', 'user_id'], as: 'saves' },
        { model: Community, attributes: ['id', 'title', 'slug'], as: 'community' },
        tagModel, likeModel, commentModel
      ]
    }).then(async posts => {
      var finalPosts
      if (req.headers.authorization && special) {
        const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
        var subscriptions = {
          communities: [],
          users: []
        }
        await Subscription.findAll({
          where: { user_id: auth.id },
          attributes: ['id', 'subscribable_type', 'subscribable_id']
        }).then(subs => {
          subs.filter(sub => {
            if (sub.subscribable_type === 'user') {
              subscriptions.users.push(sub.subscribable_id)
            } else {
              subscriptions.communities.push(sub.subscribable_id)
            }
          })
        }).catch(error => {
          return {
            message: 'Kullanıcının takip ettikleri bulunamadı.',
            error: error
          }
        })
        const subscribedPosts = posts.filter(post => {
          if (subscriptions.communities.indexOf(post.community_id) !== -1) {
            return post
          } else if (subscriptions.users.indexOf(post.user_id) !== -1) {
            return post
          }
        })

        finalPosts = subscribedPosts
      } else {
        finalPosts = posts
      }
      if (sort === 'top') {
        res.status(200).send(
          finalPosts.sort((a, b) => { return b.likes.length - a.likes.length }).slice(20 * page, (page * 20) + 20)
        )
      } else if (sort === 'hot') {
        res.status(200).send(
          finalPosts.sort((a, b) => { return b.comments.length - a.comments.length }).slice(20 * page, (page * 20) + 20)
        )
      } else if (sort === 'new') {
        res.status(200).send(
          finalPosts.sort((a, b) => { return b.created_at - a.created_at }).slice(20 * page, (page * 20) + 20)
        )
      } else {
        res.status(200).send(finalPosts)
      }
    }).catch(error => {
      res.status(404).send({
        message: 'İçerikler Bulunamadı.',
        error: error
      })
    })
  },

  async show (req, res) {
    await Post.findOne({
      where: { id: req.params.id },
      include: [
        { model: Comment, attributes: ['user_id'], as: 'comments' },
        { model: User, attributes: ['id', 'username'], as: 'user' },
        { model: Tag, attributes: ['title', 'slug'], as: 'tags', through: { attributes: [] } },
        { model: Like, attributes: ['id', 'user_id'], as: 'likes' },
        { model: Save, attributes: ['id', 'user_id'], as: 'saves' },
        { model: Community, attributes: ['id', 'title', 'slug'], as: 'community' }
      ],
      attributes: ['id', 'title', 'body', 'type', 'created_at', 'updated_at']
    }).then(post => {
      res.status(200).send(post)
    }).catch(error => {
      res.status(404).send({
        message: 'İçerik bulunamadı.',
        error: error
      })
    })
  },

  async url (req, res) {
    await Post.findOne({ where: { id: req.params.id }, attributes: ['body'] }).then(post => {
      res.status(200).send(post)
    }).catch(error => {
      res.status(404).send({
        message: 'İçerik linki bulunamadı.',
        error: error
      })
    })
  },

  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Post.create({
      user_id: auth.id,
      community_id: req.body.community_id,
      title: req.body.title,
      body: req.body.body,
      type: req.body.type
    }).then(async post => {
      var tagsToSet = req.body.tags
      if (req.body.linkToTag) {
        await Tag.findOne({ where: { title: req.body.linkToTag } }).then(tag => {
          tagsToSet.push(tag.slug)
        }).catch(async () => {
          await Tag.create({ title: req.body.linkToTag, is_link: true }).then(tag => {
            tagsToSet.push(tag.slug)
          })
        })
      }
      post.setTags(tagsToSet).then(() => {
        res.status(201).send(post)
      }).catch(error => {
        res.status(424).send({ error: 'Etiketlemede bir sıkıntı oldu. => ' + error })
      })
    }).catch(error => {
      res.status(424).send(error, {
        message: 'İçerik oluşturulamadı.',
        error: error
      })
    })
  },
  async update (req, res) {
    await Post.findById(req.params.id).then(async post => {
      await post.update({
        title: req.body.title,
        body: req.body.body,
        type: req.body.type
      }).then(async post => {
        var tagsToSet = req.body.tags
        if (req.body.linkToTag) {
          await Tag.findOne({ where: { title: req.body.linkToTag } }).then(tag => {
            tagsToSet.push(tag.slug)
          }).catch(async () => {
            await Tag.create({ title: req.body.linkToTag, is_link: true }).then(tag => {
              tagsToSet.push(tag.slug)
            })
          })
        }
        post.setTags(tagsToSet).then(() => {
          res.status(201).send(post)
        }).catch(error => {
          res.status(424).send({ error: 'Etiketlemede bir sıkıntı oldu. => ' + error })
        })
      }).catch(error => {
        res.status(424).send({
          message: 'İçerik düzenlenemedi.',
          error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'İçerik bulunamadı',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Post.findById(req.params.id).then(async post => {
      await post.destroy()
      res.status(204).send(post)
    }).catch(error => {
      res.status(424).send({
        message: 'İçerik kaldırılamadı',
        error: error
      })
    })
  },
  async recover (req, res) {
    await Post.findOne({ where: { id: req.params.id }, paranoid: false }).then(async post => {
      await post.restore().then(post => {
        res.status(200).send(post)
      }).catch(error => {
        res.status(424).send({ message: 'İçerik kurtarılamadı.', error: error })
      })
    }).catch(error => {
      res.status(404).send({message: 'İçerik bulunamadı', error: error})
    })
  }
}
