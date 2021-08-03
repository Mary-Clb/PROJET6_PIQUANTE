require('dotenv').config();

//IMPORTATION DES PLUG-IN
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Accéder au path du serveur

const userRoutes = require('./routes/user'); //Importer le router user.js
const sauceRoutes = require('./routes/sauce'); //Importer le routeur sauce.js

const app = express();

//CONNEXION BDD MONGO DB ATLAS
mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_USERPWD + '@cluster0.gnmii.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//ANTICIPER LES ERREURS CORS - AUTORISE L'ACCES DEPUIS N'IMPORTE QUELLE ORIGINE - POUR TOUTES LES REQUETES A L'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); // Indique à Express de gérer la ressources 'images' de manière statique
                                                                    // à chaque requête vers /images

//ROUTEURS                                                                    
app.use('/api/auth', userRoutes); // utiliser le router de la const userRoutes pour /api/auth
app.use('/api/sauces', sauceRoutes); // utiliser le router de la const sauceRoutes pour /api/sauces

module.exports = app;
