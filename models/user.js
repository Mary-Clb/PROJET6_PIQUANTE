const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //Importation du plugin pour vérifier qu'une adresse mail est unique

const userSchema = mongoose.Schema({                   //On utilise la fonction Schema() de Mongoose pour créer un objet
    email: { type: String, required: true, unique: true }, //On utilise une clé (champ) à laquelle on passe un objet pour configurer le champ
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //On applique la fonction plugin() à userSchema avec 'uniqueValidator' en arguement pour vérifier que l'adresse mail est unique
                                    //avant l'importation du modèle

module.exports = mongoose.model('User', userSchema); //On passe le nom du modèle et le schéma qu'on va utiliser en arguments à la fonction model()
                                                    // de Mongoose pour pouvoir l'exporter et utiliser le modèle