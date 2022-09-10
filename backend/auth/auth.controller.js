const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';

exports.createUser = (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    rol: req.body.rol,
    password: bcrypt.hashSync(req.body.password)
  }


  User.create(newUser, (err, user) => {

    if (err && err.code === 11000) return res.status(409).send('Email already exists');
    if (err) return res.status(500).send('Server error');
    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({ id: user.id },
      SECRET_KEY, {
        expiresIn: expiresIn
      });
    const dataUser = {
      name: user.name,
      email: user.email,
      rol: user.rol,
      accessToken: accessToken,
      expiresIn: expiresIn
    }
    // response 
    res.send({ dataUser });
  });
}

exports.loginUser = (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password
  }
  User.findOne({ email: userData.email }, (err, user) => {
    if (err) return res.status(500).send('Server error!');

    if (!user) {
      // email does not exist
      res.status(409).send({ message: 'Something is wrong correo invalido' });
    } else {
      const resultPassword = bcrypt.compareSync(userData.password, user.password);
      if (resultPassword) {
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });

        const dataUser = {
          name: user.name,
          email: user.email,
          rol: user.rol,
          accessToken: accessToken,
          expiresIn: expiresIn
        }
        res.send({ dataUser });
        
      } else {
        // password wrong
        res.status(409).send({ message: 'Something is wrong clave invalida' });
      }
    }
  });
}

  exports.updateUser = (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    rol: req.body.rol
  }
    User.findOneAndUpdate({ email: userData.email},
                          {name: userData.name, rol: userData.rol}, (err, user) => {
      if (err) return res.status(500).send('Server error!');
      if (!user) {
        res.status(409).send({ message: 'Something is wrong usuario no existe' });
      }else{
          
          const dataUser = {
            name: user.name,
            email: user.email,
            rol: user.rol
          }
          res.send({ dataUser });
          
    }});

}

exports.deleteUser = (req, res) => {
  const userData = {
    email: req.body.email
  }
    User.findOneAndRemove({ email: userData.email}, (err, user) => {
      if (err) return res.status(500).send('Server error!');
      if (!user) {
        res.status(409).send({ message: 'Something is wrong usuario no existe  f' });
      }else{
          res.send( {message: 'usuario eliminado' });
          
    }});

}









