const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Gère l'Inscription
exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const new_user = new User({
        email: req.body.email,
        password: hash
      });
      new_user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
//Gère la connexion
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
          if(result) {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
            })
          } else {
            res.status(401).json("Mot de passe incorrect ", err);
          }
      })     
    })
    .catch(error => res.status(404).json({ error }));
};