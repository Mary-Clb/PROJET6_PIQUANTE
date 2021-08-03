const http = require('http'); //Importation du package http natif de node pour créer le serveur
const app = require('./app'); //Importer App.js

const normalizePort = val => {   //Renvoie un port valide qu'il soit sous la forme d'un nombre ou d'une chaine de caractère
  const port = parseInt(val, 10); 

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); //On écoutera soit le port par défaut, soit le port 3000
app.set('port', port); //On demande à l'application d'écouter le port concerné

const errorHandler = error => {   //Recherche des différentes erreurs
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); //On passe "app" en argument puisque c'est une fonction (express) qui va recevoir
                                       // les requêtes et les réponses et les gérer 
server.on('error', errorHandler);
server.on('listening', () => {        //Ecouteur d'évènements qui enregistre le port/canal sur lequel le serveur s'éxécute dans la console
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
