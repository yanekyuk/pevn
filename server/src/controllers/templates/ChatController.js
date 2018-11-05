const {Chat, UserChat, User, Message} = require('../models')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

module.exports = {
  async check_unread (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await User.findById(auth.id).then(user => {
      user.getChats().then(chats => {
        const stripped = chats.map(chat => { return chat.UserChat.is_read })
        const unreads = stripped.filter(value => value === false)
        res.status(200).send(unreads) // SHOULD BE CONVERTED TO LENGTH ON CLIENT
      }).catch(error => {
        res.status(404).send({
          message: 'Mesajlaşmalar bulunamadı.',
          error: error
        })
      })
    })
  },
  async index (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await User.findById(auth.id).then(user => {
      user.getChats({
        attributes: ['id', 'title', 'created_at'],
        include: [
          { model: User, as: 'users', where: { id: { [Op.not]: user.id } }, attributes: ['id', 'username', 'slug'] },
          { model: Message, as: 'lastMessage', attributes: ['body', 'created_at'] }
        ]
      }).then(chats => {
        res.send(chats)
      }).catch(error => {
        res.status(404).send({
          message: 'Kullanıcının mesajlaşması yok.',
          error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Mesajlaşmalar bulunamadı.',
        error: error
      })
    })
  },
  async create (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await Chat.create({ 'title': req.body.title, 'is_read': true }).then(chat => {
      if (req.body.users.indexOf(auth.id) !== -1) {
        res.status(403).send({
          message: 'Kendinizden sadece bir tane var bu dünyada!'
        })
      }
      var users = [auth.id]
      req.body.users.forEach(user => {
        users.push(user)
      })
      chat.setUsers(users).then(async () => {
        // res.send(chat)
        await Chat.findOne({
          where: { id: chat.id },
          include: [{ model: User, as: 'users', attributes: ['id', 'username', 'slug'] }]
        }).then(chat => {
          res.status(201).send(chat)
        })
      }).catch(error => {
        res.status(424).send({
          message: 'Kullanıcı eklerken bir sıkıntı oldu.',
          error: error
        })
      })
    }).catch(error => {
      res.status(424).send({
        message: 'Mesajlaşma yaratmada bir sıkıntı oldu.',
        error: error
      })
    })
  },
  async exit (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await UserChat.findOne({
      where: { chat_id: req.params.id, user_id: auth.id }
    }).then(userChat => {
      userChat.destroy()
      res.status(204).send({ message: 'Mesajlaşmadan çıkıldı.' })
    }).catch(error => {
      res.status(404).send({ message: 'Mesajlaşma bulunamadı.', error: error })
    })
  },
  async update (req, res) {
    await Chat.findById(req.params.id).then(chat => {
      chat.addUser(req.body.users)
      res.status(201).send(chat)
    }).catch(error => {
      res.status(424).send({
        message: 'Kullanıcı mesajlaşmaya eklenemedi!',
        error: error
      })
    })
  },
  async delete (req, res) {
    await Chat.findById(req.params.id).then(chat => {
      chat.destroy()
      res.status(204).send({ message: 'Mesajlaşma kaldırıldı.' })
    }).catch(error => {
      res.status(424).send({
        message: 'Mesajlaşma kaldırılamadı.',
        error: error
      })
    })
  }
}
