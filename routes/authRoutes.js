const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/pedido');
  }
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send('Usuario no encontrado');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send('Contraseña incorrecta');
  }

  req.session.userId = user._id;
  res.redirect('/pedido');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.get('/pedido', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('pedido', { pedidos: [] });
});

module.exports = router;
