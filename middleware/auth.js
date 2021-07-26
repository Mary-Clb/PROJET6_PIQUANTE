//DANS LES ROUTES DANS LESQUELLES IL EST APPELE,
//LE MIDDLEWARE D'AUTHENTIFICATION VA PERMETTRE DE VERIFIER QUE L'UTILISATEUR EST BIEN
//IDENTIFIE AVANT DE POUVOIR EFFECTUER LES DIFFERENTES REQUETES 
//COMME CREER, MODIFIER ET SUPPRIMER UNE SAUCE 

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //On extrait le token du header de la requête
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //On utilise la méthode Verify() de JWT pour vérfier que le token est valide
    const userId = decodedToken.userId; //On extrait l'Id du token
    if (req.body.userId && req.body.userId !== userId) { //Si l'id de l'utilisateur qui veut faire la requête est différent de l'Id du token
      throw 'Invalid user ID';                           //On renvoit une erreur pour dire que l'utilisateur est invalide
    } else {
      next(); //Sinon, on continue avec l'exécution de la requête demandée par l'utilisateur
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};