const factory = require('../factories')

module.exports = {
  async createStuff (req, res) {
    try {
      await factory.createAll(req.query.amount).then(() => {
        res.send('OK')
      })
    } catch (err) {
      res.status(500).send({
        error: 'Test çalıştırılımadı. => ' + err
      })
    }
  }
}
