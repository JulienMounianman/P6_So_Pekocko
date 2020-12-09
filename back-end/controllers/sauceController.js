const Sauce = require('../models/Sauce.js');
const fs = require('fs');

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res) => {
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutéé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res) => {
    const sauce = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.updateLikeSauce = (req, res) => {
    if (req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.usersLiked.filter(userId => userId === req.body.userId).length > 0) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: - 1 }, $pull: { usersLiked: req.body.userId } })
                .then(() => res.status(200).json("vous n'aimez plus cette sauce"))
                .catch(error => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.filter(userId => userId === req.body.userId).length > 0) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: - 1 }, $pull: { usersDisliked: req.body.userId } })
                .then(() => res.status(200).json("Cette sauce ne fait plus partie de celles que vous n'aimez pas"))
                .catch(error => res.status(400).json({ error }));
            }
        })
    }
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: + 1 }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json("vous aimez cette sauce"))
            .catch(error => res.status(400).json({ error }));
    }
    if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: + 1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json("vous n'aimez pas cette sauce"))
            .catch(error => res.status(400).json({ error }));
    }
};