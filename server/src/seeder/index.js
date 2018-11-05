const {User, UserSetting} = require('../models')
// const faker = require('faker')

module.exports = {
  async createStuff () {
    // CREATE USER
    try {
      await User.create({
        'email': 'admin@test.com',
        'username': 'admin',
        'role_id': 2,
        'password': 'password'
      }).then(async User => {
        await UserSetting.create({
          'user_id': User.dataValues.id
        })
      })
    } catch (err) {
      console.log('USER COULD NOT BE CREATED: ' + err)
    }
    try {
      await User.create({
        'email': 'editor@test.com',
        'username': 'editor',
        'role_id': 1,
        'password': 'password'
      }).then(async User => {
        await UserSetting.create({
          'user_id': User.dataValues.id
        })
      })
    } catch (err) {
      console.log('USER COULD NOT BE CREATED: ' + err)
    }
    try {
      await User.create({
        'email': 'user@test.com',
        'username': 'user',
        'role_id': 0,
        'password': 'password'
      }).then(async User => {
        await UserSetting.create({
          'user_id': User.dataValues.id
        })
      })
    } catch (err) {
      console.log('USER COULD NOT BE CREATED: ' + err)
    }
  }
}
