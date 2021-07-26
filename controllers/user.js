
//Importation des plug-in utilisés dans les controllers
const bcrypt = require('bcrypt'); //Importation du plugin de cryptage
const User = require('../models/user'); //Importation du modèle 'User'
const jwt = require('jsonwebtoken'); //Importation du plugin de création de TOKEN
const obfuscatorEmail = require('obfuscator-email'); //Importation du plugin de masquage de l'adresse mail
const validate = require('validate-mail'); //Importation du plugin de validation de l'adresse mail (conformité)


//CREATION D'UN COMPTE CLIENT
exports.signup = (req, res, next) => {
    const obfuscateEmail = obfuscatorEmail(req.body.email); //Masquage de l'adresse mail dans la BDD

    if (validate(req.body.email)) {    //Si l'adresse mail est valide, on poursuit l'opération
    bcrypt.hash(req.body.password, 10) //avec la méthode hash() du plugin BCRYPT pour le mdp
      .then(hash => {
        const user = new User({       //On créé un nouvel user avec le modèle
          email: obfuscateEmail,
          password: hash
        });
        user.save() //On sauvegarde le nouvel user dans la BDD
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else{
      return res.status(403).json({ message: 'Adresse mail non valide !'}); //Si l'adresse mail est non valide, on retourne un status 403
  }

};

//CONNEXION A UN COMPTE CLIENT EXISTANT
  exports.login = (req, res, next) => {
    const obfuscateEmail = obfuscatorEmail(req.body.email);

    User.findOne({ email: obfuscateEmail }) //On cherche l'email utilisateur correspondant à l'email de la requête
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //Si le mail ne correspond à aucun user existant, on renvoit un status 401
        }
        bcrypt.compare(req.body.password, user.password) //On compare le mdp du corps de la requête avec celui de l'utilisateur indiqué
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' }); //Si le mdp ne correspond à aucun mdp d'un user existant, on renvoit un status 401
            }
            res.status(200).json({ //Si email et mdp ok :
              userId: user._id,
              token: jwt.sign(    //On utilise la fonction sign() de JWT pour encoder un nouveau TOKEN qui sera renvoyé au front-end
                { userId: user._id }, //avec l'identifiant de l'utilisateur + une chaine de caractère aléatoire, 
                'RANDOM_TOKEN_SECRET', //qui seront visible dans DevTools > Network > request Headers > Authorization
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };