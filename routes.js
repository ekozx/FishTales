var main = require('./controllers/mainController.js');

module.exports = function(app, express, passport) {
  //HTTP GET
  app.get('/', main.index, app);
  app.get('/about', main.about, app);
  //HTTP POST
  app.post('/store', main.storeNet, app);
};
