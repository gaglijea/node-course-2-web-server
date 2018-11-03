const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');



//permets de faire un traitement avant que les requests passent
app.use((request, response, next) => {
  var now = new Date().toString();
var logdata = `${now}: ${request.ip} ${request.method} ${request.url}`;
  console.log(logdata);
  fs.appendFile('server.log', logdata + '\n', (err) => {
    if (err) {
      console.log('Unable to write to log');
    }
  });

  next();
});

app.use((request, response, next) => {
  //response.render('maintenance.hbs');
  next();   //cette reponse est essentielle sinon le site passe pas à la suite
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (request, response) => {
  response.render('home.hbs', {
   pageTitle: 'Bienvenue chez Logix Opérations',
   paragraph1: `Page d'accueil`,
 });
});

app.get('/about', (request, response) => {
   response.render('about.hbs', {
    pageTitle: 'À propos de Logix Opérations',
    paragraph1: 'Hello World !',
  });
});


app.get('/bad', (request, response) => {
  //response.send('<h1>Hello Express<h1>');
  response.send({
    errorMessage: 'Unable to fulfil request'
  });
});


app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
