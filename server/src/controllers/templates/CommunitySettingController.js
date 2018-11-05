const {Community} = require('../models')

module.exports = {
  async update (req, res) {
    await Community.findOne({ where: { slug: req.params.slug } }).then(async community => {
      await community.getSettings().then(settings => {
        settings.update(req.body)
        res.status(201).send(settings)
      }).catch(error => {
        res.status(404).send({
          message: 'Topluluk ayarları bulunamadı.', error: error
        })
      })
    }).catch(error => {
      res.status(404).send({
        message: 'Topluluk bulunamadı.', error: error
      })
    })
  }
}
