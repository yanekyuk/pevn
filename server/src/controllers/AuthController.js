const {User, UserSetting, PasswordReset, Community} = require('../models')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async index (req, res) {
    await User.findAll().then(auths => {
      res.status(200).send(auths)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcılar bulunamadı.',
        error: error
      })
    })
  },
  async show (req, res) {
    await User.findById(req.params.id).then(auth => {
      res.status(200).send(auth)
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı.',
        error: error
      })
    })
  },
  /// WARNING SECURITY API SHOULD BE LIMITED FOR SOME FUNCTIONS HERE
  async register (req, res) {
    const {email, username, password} = req.body
    await User.create({
      'email': email,
      'username': username,
      'password': password
    }).then(user => {
      UserSetting.create({ 'user_id': user.id }).then(() => {
        console.log('okay')
      }).catch(error => {
        res.send(error)
      })
      res.status(200).send(user)
    }).catch(error => {
      res.status(424).send({
        message: 'Kaydolunamadı.',
        error: error
      })
    })
  },
  async update (req, res) {
    const {oldPassword, newPassword, email} = req.body
    await User.findById(req.params.id).then(async user => {
      const isPasswordValid = await user.comparePassword(oldPassword)
      if (isPasswordValid) {
        if (email) {
          user.update({ 'email': email }).then(() => {
            res.status(201).send(user)
          }).catch(error => {
            res.status(403).send({
              message: 'E-Posta değiştirilemedi.',
              error: error
            })
          })
        }
        if (newPassword) {
          user.update({ 'password': newPassword }).then(() => {
            res.status(201).send(user)
          }).catch(error => {
            res.status(403).send({
              message: 'Parola değiştirilemedi.',
              error: error
            })
          })
        }
        // if (newPassword) { User.update({ 'password': newPassword }, { where: { id: user.id } }) }
        // if (newPassword) { user.update({ 'password': newPassword }) }
        // res.status(201).send(user)
      } else {
        res.status(403).send({
          message: 'Parola uyuşmadı.'
        })
      }
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı.',
        error: error
      })
    })
  },
  async verify (req, res) {
    const auth = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    await User.findOne({
      where: { id: auth.id },
      include: [{ model: UserSetting, as: 'settings' }, { model: Community, as: 'communities' }]
    }).then(user => {
      res.status(200).send(user)
    }).catch(error => {
      res.status(424).send({
        message: 'Kullanıcı bulunamadı.',
        error: error
      })
    })
  },
  async login (req, res) {
    const {email, password} = req.body
    await User.findOne({ where: { email: email } }).then(async user => {
      const isPasswordValid = await user.comparePassword(password)
      if (isPasswordValid) {
        res.status(200).send({
          token: jwtSignUser(user.toJSON())
        })
      } else {
        res.status(403).send({
          message: 'Parola uyuşmadı'
        })
      }
    }).catch(async error => {
      await User.findOne({ where: { email: email }, paranoid: false }).then(async user => {
        const isPasswordValid = await user.comparePassword(password)
        if (isPasswordValid) {
          await user.restore().then(() => {
            res.status(200).send({
              message: 'Kullanıcı aktif edildi.',
              enabled: true,
              token: jwtSignUser(user.toJSON())
            })
          }).catch(error => {
            res.status(424).send({
              message: 'Kullanıcı devredışı.',
              error: error
            })
          })
        } else {
          res.status(404).send({
            message: 'Kullanıcı bulunamadı.',
            error: error
          })
        }
      }).catch(() => {
        res.status(404).send({
          message: 'Kullanıcı bulunamadı.',
          error: error
        })
      })
    })
  },
  async forgot (req, res) {
    const buf = crypto.randomBytes(20)
    const token = buf.toString('hex')
    const user = await User.findOne({ where: { email: req.body.email } })
    await PasswordReset.findAll({ where: { user_id: user.id } }).then(passwordResets => {
      passwordResets.forEach(passwordReset => {
        passwordReset.destroy()
      })
    }).catch(error => { console.log(error) })
    await PasswordReset.create({
      'user_id': user.id,
      'token': token
    }).catch(error => { res.status(424).send({ message: 'Token oluşturulamadı!', error: error }) })
    await User.findOne({
      where: { email: req.body.email },
      include: [{ model: PasswordReset, as: 'passwordReset', attributes: ['token'] }]
    }).then(async user => {
      try {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: { user: 'iletisim@hicerik.org', pass: '4oCtj&6ByIC2^Rj' }
        })
        var mailOptions = {
          to: user.email,
          from: 'iletisim@hicerik.org',
          subject: 'Parola yenileme | Hiçerik',
          text: 'Parola yenileme talebiniz alındı. Aşağıdaki linke tıklayarak yeni parola oluşturabilirsiniz.\n\nhttps://hicerik.org/p/' + token + '\n\nEğer yeni parola talep etmediyseniz, bu postayı görmezden gelebilirsiniz.'
        }
      } catch (error) {
        res.status(424).send({
          message: 'Posta sunucusu kurulamadı.',
          error: error
        })
      }
      await smtpTransport.sendMail(mailOptions).then(() => {
        res.status(200).send({
          message: `Parola yenileme talebi başarıyla ${user.email} adresine gönderildi!`
        })
      }).catch(error => {
        res.status(424).send({
          message: `Parola yenileme talebi başarısız oldu.`,
          error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Kullanıcı bulunamadı.',
        error: error
      })
    })
  },
  async newPassword (req, res) {
    await PasswordReset.findOne({ where: { token: req.body.token } }).then(async passwordReset => {
      await User.findOne({ where: { id: passwordReset.user_id } }).then(async user => {
        user.update({ password: req.body.password })
        passwordReset.destroy()
        res.status(201).send({ message: 'Parola başarıyla değiştirildi.' })
      }).catch(error => {
        res.status(404).send({ message: 'Kullanıcı bulunamadı.', error: error })
      })
    }).catch(error => { res.status(404).send({ message: 'Parola sıfırlama isteği bulunamadı.', error: error }) })
  },
  async delete (req, res) {
    await User.findById(req.params.id).then(async user => {
      await user.destroy().then(user => {
        res.status(204).send({
          message: 'Kullanıcı kaldırıldı.'
        })
      })
    }).catch(error => {
      res.status(424).send({
        message: 'Kullanıcı kaldırılamadı.',
        error: error
      })
    })
  }
}
