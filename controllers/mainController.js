exports.index = function(req, res, app) {
	res.render('index', {"title": "hello"});
};