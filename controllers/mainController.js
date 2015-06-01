exports.index = function(req, res, app) {
	res.render('index', {"title": "hello"});
}; 
exports.about = function(req, res, app) {
	res.render('about');
}