const Sauce = require('../models/sauce.js');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauce = req.body.sauce;
    const img = req.body.image;

    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.usersLikes = [];
    sauce.disliked = [];
    
    //Image?
 
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutéé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    if(req.body.image) {
        //Image?
    } else {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateLikeSauce = (req, res, next) => {

};