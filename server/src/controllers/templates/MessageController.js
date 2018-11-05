const {Chat, Message, User, UserChat} = require('../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

module.exports = {
  async index (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Chat.findById(req.params.id).then(async chat => {
      await chat.getMessages({
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'slug'] }]
      }).then(async messages => {
        await UserChat.findOne({
          where: { user_id: auth.id, chat_id: chat.id }
        }).then(userchat => { userchat.update({ 'is_read': true }) })
        res.status(200).send(messages)
      }).catch(error => {
        res.status(404).send({
          message: 'Mesajlar bulunamadı.',
          error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Mesajlaşma bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Message.create({
      'user_id': auth.id,
      'body': req.body.body,
      'chat_id': parseInt(req.params.id)
    }).then(message => {
      message.getChat().then(async chat => {
        chat.update({ 'last_message': message.id }).then(() => {
          res.status(201).send(message)
        })
        await UserChat.findAll({
          where: { chat_id: chat.id, user_id: { [Op.not]: auth.id } }
        }).then(userchats => {
          userchats.forEach(userchat => {
            userchat.update({'is_read': false})
          })
        })
      })
    }).catch(error => {
      res.status(424).send({
        message: 'Mesaj yaratılamadı.',
        error: error
      })
    })
  },
  async update (req, res) {
    await Message.findById(req.params.id).then(message => {
      message.update({ 'body': req.body.body })
      res.status(201).send(message)
    }).catch(error => {
      res.status(424).send({
        message: 'Mesaj değiştirilemedi!',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Message.findById(req.params.id).then(message => {
      message.destroy()
      res.status(204).send({ message: 'Mesajlaşma kaldırıldı.' })
    }).catch(error => {
      res.status(424).send({
        message: 'Mesaj kaldırılamadı.',
        error: error
      })
    })
  }
}
