//LES CONTROLLERS CONTIENNENT LA LOGIQUE METIER DU PROJET. AUTREMENT DIT, 
//TOUTES LES FONCTIONS REQUISES A L'API ET LES ACTIONS QU'ELLES DOIVENT EXECUTER

//IMPORTATION DU MODELE SAUCE
const Sauce = require('../models/sauce');

//IMPORTATION DU MODULE DE GESTION DE FICHIER NODE.JS
const fs = require('fs');

//CREATION D'UNE SAUCE
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // On récupère l'objet Json qu'on transforme en objet Javascript
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // L'opérateur SPREAD va récupérer tous les éléments de l'objet sauceObject
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //résolution de l'URL pour récupérer l'image
    });

    sauce.save() //on utilise la méthode save() pour enregistrer l'élément dans la BDD
        .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //On renvoie un status 200 pour dire que la requête a fonctionné
        .catch(error => res.status(400).json({ error })); //On renvoit un status 400 dans le cas où la requête n'a pas abouti
};


//AFFICHER UNE SAUCE EN FONCTION DE SON ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({             //On utilise la méthode findOne() avec pour paramètre l'id de la requête, qui doit
        _id: req.params.id      // correspondre l'id de la sauce
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


//GESTION DES LIKES
exports.likes = (req, res, next) => {
        const userId = req.body.userId;
        const like = req.body.like;

        Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
            if (like === 1 && !sauce.usersLiked.includes(userId)) {  //Si l'user like et qu'il ne fait pas partie du tableau usersLiked
              Sauce.updateOne({ _id: req.params.id }, {             
                  $inc: { likes: 1 },            // On ajoute 1 aux likes
                  $push: { usersLiked: userId}, // On push l'userId dans le tableau usersLiked
              })
                  .then (() => res.status(201).json({ message: 'Sauce likée !'}))
                  .catch((error) => res.status(400).json ({ error }));
            }

           if (like === 0 && sauce.likes > 0 || sauce.dislikes > 0 ) {  //Si l'user retire un like ou un dislike sur une sauce qui a déjà un
             if (sauce.usersLiked.includes(userId)) {                   //like ou un dislike, si il fait partie du tableau usersLiked : 
               Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: -1},                 //On retire un like
                $pull: { usersLiked: userId},       //On retire l'user du tableau usersLiked
              })
              .then(() => res.status(201).json({ message:'Like supprimé !'}))
              .catch((error) => res.status(400).json({ error }));

             }
              if (sauce.usersDisliked.includes(userId)) {             //Si l'user fait partie du tableau usersDisliked :
                Sauce.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes: -1},            //On retire un dislike
                  $pull: { usersDisliked: userId},  //On retire l'user du tableau usersdisliked
                })
                .then(() => res.status(201).json({ message:'Dislike supprimé !'}))
                .catch((error) => res.status(400).json({ error }));

              }
                
           }

           if (like === -1) {             //Si l'user met un dislike
             Sauce.updateOne({ _id: req.params.id }, {
               $inc: { dislikes: 1 },     //On ajoute un dislike
               $push: { usersDisliked: userId }, //On rajoute l'UserId dans le tableau usersDisliked
             })
              .then(() => res.status(201).json({ message: 'Sauce dislikée !'}))
              .catch((error) => res.status(400).json({ error }));
           }
          })

          .catch((error) => res.status(404).json({ error }));
};

//MODIFIER UNE SAUCE
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?  // on regarde si le fichier image existe
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on traite la nouvelle image
      } : { ...req.body }; // si pas d'image, on traite le corps de la requête
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // On met à jour la sauce avec le body de la requête
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  
  //SUPPRIMER UNE SAUCE
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //On recherche une sauce par rapport à son ID
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; 
        fs.unlink(`images/${filename}`, () => {  //On delete le fichier image
          Sauce.deleteOne({ _id: req.params.id }) //On delete la sauce
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  //AFFICHER TOUTES LES SAUCES
  exports.getAllSauces = (req, res, next) => {
    Sauce.find({}).then(    //On utilise la méthode find() sans paramètres pour afficher toutes les sauces
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