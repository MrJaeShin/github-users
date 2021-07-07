var express = require('express');
var router = express.Router();
const request = require('request');

const rootURL = 'https://api.github.com/';

/* GET home page. */
router.get('/', function (req, res, next) {
	const userName = req.query.username;

	if (!userName) {
		return res.render('index', { userData: null });
	}

	const options = {
		url: `${rootURL}users/${userName}`,
		headers: {
			'User-Agent': 'chasmad',
			Authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	};

	request(options, function (err, response, body) {
		const userData = JSON.parse(body);
		// update the opptions url to fetch the user's repo
		options.url = userData.repos_url;

		request(options, function (err, reponse, body) {
			// add a repos property
			userData.repos = JSON.parse(body);
			console.log(userData.repos[0]);
			res.render('index', { userData });
		});
	});
});

module.exports = router;
