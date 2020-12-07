const Sauce = require('../models/sauce.js');
const fs = require('fs');

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
    const sauce = JSON.parse(req.body.sauce);
    const newsauce = new Sauce({
        userId: sauce.userId,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat: sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: req.protocol + '://'+ req.get('host') +  '/images/' + req.file.filename
    })
    newsauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutéé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauce = req.file?
    {
    ...JSON.parse(req.body.sauce),
    imageUrl: req.protocol + '://'+ req.get('host') +  '/images/' + req.file.filename
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
              Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });
          })
          .catch(error => res.status(500).json({ error }));
};

exports.updateLikeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let message = "";
            console.log(sauce.likes);
            if(req.body.like === 0){
                if(sauce.usersLiked.filter(userId => userId === req.body.userId).length > 0) {
                    const i = sauce.usersLiked.indexOf(req.body.userId);
                    if (i > -1) {
                        sauce.usersLiked.splice(i, 1);
                        sauce.likes = sauce.likes - 1;
                        message = "vous n'aimez plus cette sauce";
                    }
                }
                if(sauce.usersDisliked.filter(userId => userId === req.body.userId).length > 0) {
                    const i = sauce.usersDisliked.indexOf(req.body.userId);
                    if (i > -1) {
                        sauce.usersDisliked.splice(i, 1);
                        sauce.dislikes = sauce.dislikes - 1;
                        message = "Cette sauce ne fait plus partie de celles que vous n'aimez pas";
                    }
                }
            }
            if(req.body.like === 1){  
                sauce.usersLiked.push(req.body.userId);
                sauce.likes = sauce.likes + 1;
                message = "vous aimez cette sauce";
            }
            if(req.body.like === -1){
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes = sauce.dislikes + 1;
                message = "vous n'aimez pas cette sauce";
            }
            Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, dislikes: sauce.dislikes, usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, _id: req.params.id })
            .then(() => res.status(200).json({ message: message}))
            .catch(error => res.status(400).json({ error }));        
        })        
        .catch(error => {
            console.log(error);
            res.status(404).json({ error })
        });
};
