var main = require('./controllers/mainController.js');

module.exports = function(app, express, passport) {
  //HTTP GET /
  app.get('/', main.index, app);
};
