const User = require('../models/User.js');

exports.signup = (req, res, next) => {
  const new_user = new User({
    email: req.body.email,
    password: req.body.password
  });
  console.log(new_user);
  new_user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }));
};


exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};