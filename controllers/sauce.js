
const Sauce = require('../models/sauce');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({ error: error});
        }
    );
};


exports.likes = (req, res, next) => {
        const userId = req.body.userId;
        const like = req.body.like;

        Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
            if (like === 1 && !sauce.usersLiked.includes(userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                  $inc: { likes: 1 },
                  $push: { usersLiked: userId},
              })
                  .then (() => res.status(201).json({ message: 'Liked Sauce !'}))
                  .catch((error) => res.status(400).json ({ error }));
            }

            console.log(sauce);

           if (like === 0 && sauce.likes > 0 || sauce.dislikes > 0 ) {
             if (sauce.usersLiked.includes(userId)) {
               Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: -1},
                $pull: { usersLiked: userId},
              })
              .then(() => res.status(201).json({ message:'Removed Like !'}))
              .catch((error) => res.status(400).json({ error }));

             }
              if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes: -1},
                  $pull: { usersDisliked: userId},
                })
                .then(() => res.status(201).json({ message:'Removed Dislike !'}))
                .catch((error) => res.status(400).json({ error }));

              }
                
           }

           console.log(sauce);

           if (like === -1) {
             Sauce.updateOne({ _id: req.params.id }, {
               $inc: { dislikes: 1 },
               $push: { usersDisliked: userId },
             })
              .then(() => res.status(201).json({ message: 'Disliked Sauce !'}))
              .catch((error) => res.status(400).json({ error }));
           }
          })

          .catch((error) => res.status(404).json({ error }));
};




exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.getAllSauces = (req, res, next) => {
    console.log(Sauce);
    Sauce.find({}).then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };