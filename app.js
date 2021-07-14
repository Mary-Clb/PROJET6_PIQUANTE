const express = require('express');

const app = express();


//ANTICIPER LES ERREURS CORS - AUTORISE L'ACCES DEPUIS N'IMPORTE QUELLE ORIGINE - POUR TOUTES LES REQUETES A L'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//


app.use((req, res,) => {
    res.json({ message: 'Votre requête a bien été reçue !'})
});

module.exports = app;
