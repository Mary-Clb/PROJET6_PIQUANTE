//CE MIDDLEWARE PERMET DE GERER LES FICHIERS IMAGES ENTRANTS GRACE AU PLUGIN MULTER

const multer = require('multer');

const MIME_TYPES = { //On gère l'extension de fichier en lui indiquant par quoi remplacer les mime types
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //On indique à Multer où enregistrer les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //Utiliser le nom d'origine, supprimer les espaces et les remplacer par des '_'
    const extension = MIME_TYPES[file.mimetype];   //L'extension correspond au mime type du fichier envoyé par la requête       
    callback(null, name + Date.now() + '.' + extension); //Création du nom entier
  }
});

module.exports = multer({storage: storage}).single('image'); //On appelle Multer pour l'exporter, auquel on passe la constante 'storage'
                                                            //On précise qu'il s'agit uniquement de fichier image avec .single('image')