// CONTROLLERS
const AuthController = require('./controllers/AuthController')
const UserSettingController = require('./controllers/UserSettingController')
// MIDDLEWARES
const check = require('./middlewares/checkAuth')
const owner = require('./middlewares/checkOwner')

module.exports = (app) => {
  // ADMIN ENDPOINTS
  app.get('/admin/users', check.admin, AuthController.index)
  app.get('/admin/user/:id', check.admin, AuthController.show)
  app.put('/admin/user/:id', check.admin, AuthController.update)
  app.delete('/admin/user/:id', check.admin, AuthController.delete)
  // AUTH ENDPOINTS
  app.get('/auth/verify', AuthController.verify)
  app.post('/auth/login', AuthController.login)
  app.post('/auth/register', AuthController.register)
  app.put('/auth/:id/settings', check.writer, owner.user, UserSettingController.update)
  app.put('/auth/:id/update', check.writer, owner.user, AuthController.update)
  app.post('/auth/forgot', AuthController.forgot)
  app.post('/auth/new-password', AuthController.newPassword)
  app.delete('/auth/:id', check.writer, owner.user, AuthController.delete)
}
