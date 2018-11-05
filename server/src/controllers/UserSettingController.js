const {UserSetting} = require('../models')

module.exports = {
  async update (req, res) {
    await UserSetting.findOne({ where: { user_id: req.params.id } }).then(settings => {
      settings.update(req.body)
      res.status(201).send(settings)
    }).catch(error => {
      res.status(424).send({
        message: 'Ayarlar değiştirilemedi.',
        error: error
      })
    })
  }
}
