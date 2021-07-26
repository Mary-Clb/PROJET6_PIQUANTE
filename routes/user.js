const express = require('express');
const router = express.Router(); //Démarrage du routeur avec Express

const userCtrl = require('../controllers/user'); //Définir l'accès aux controllers

router.post('/signup', userCtrl.signup); // Pour un type de requête et une route définis, on importe
router.post('/login', userCtrl.login);  //  le controller indiqué en paramètre

module.exports = router;