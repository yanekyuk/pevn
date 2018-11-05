const faker = require('faker')
const models = require('../models')

module.exports = {
  // STARTER
  async createAll (n) {
    await this.createUsers(n)
  },
  // CREATORS
  async createUsers (n) {
    try {
      for (var i = 0; i < n; i++) {
        await this.generateUser()
      }
    } catch (err) {
      console.log('generateUsersAndCommunities failed => ' + err)
    }
  },
  // GENERATORS
  async generateUser () {
    try {
      await models.User.create({
        'email': faker.internet.email(),
        'username': faker.internet.domainWord(),
        'password': 'password',
        'created_at': faker.date.past()
      }).then(async User => {
        await models.UserSetting.create({
          'user_id': User.dataValues.id
        })
      })
    } catch (err) {
      console.log('USER FACTORY FAILED => ' + err)
    }
  }
}
