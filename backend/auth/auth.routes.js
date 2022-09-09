const Users = require('./auth.controller');
module.exports = (router) => {
  router.post('/register', Users.createUser);
  router.post('/login', Users.loginUser);
  router.post('/update', Users.updateUser);
  router.post('/delete', Users.deleteUser);
}