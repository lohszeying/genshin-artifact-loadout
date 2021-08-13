const sql_query = require('../sql');
const passport = require('passport');
const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const round = 10;
const salt = bcrypt.genSaltSync(round);

function initRouter(app) {
    /* GET home page. */
    /*app.get('/', function (req, res, next) {
        res.render('index', { title: 'Express', name: 'Tiger Nixon' });
		//res.render('index');
	}); */

	app.get('/', index);

    /* PROTECTED GET */
    app.get('/register', passport.antiMiddleware(), register);
    app.get('/password', passport.antiMiddleware(), retrieve);

    /* PROTECTED POST */
	app.post('/reg_user', passport.antiMiddleware(), reg_user);

	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/?login=success',
		failureRedirect: '/?login=failed'
	}));

	app.get('/logout', passport.authMiddleware(), logout);

	app.get('/401', function (req, res, next) {
		res.render('401');
	});

	app.get('/404', function (req, res, next) {
		res.render('404');
	});

	app.get('/500', function (req, res, next) {
		res.render('500');
	});
}

// Render Function
function basic(req, res, page, other) {
	var info = {
		page: page,
		user: req.user.username,
	};
	if (other) {
		for (var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}

// GET
function index(req, res, next) {
	if (!req.isAuthenticated()) {
		res.render('index', { page: '', auth: false, title: 'Express', name: 'Tiger Nixon' });
	} else {
		basic(req, res, 'index', { page: '', auth: true, title: 'Express', name: 'Tiger Nixon' });
	}
}


function register(req, res, next) {
    res.render('register', { page: 'register', auth: false });
}
function retrieve(req, res, next) {
    res.render('password', { page: 'password', auth: false });
}

function reg_user(req, res, next) {
	var username = req.body.username;
	var password = bcrypt.hashSync(req.body.password, salt);
	console.log("pass is: " + password);
	pool.query(sql_query.query.add_user, [username, password], (err, data) => {
		if (err) {
			console.error("Error in adding user, user already exist", err);
			res.redirect('/register?registration=failed');
		} else {
			req.login({
				username: username,
				passwordHash: password

			}, function (err) {
				if (err) {
					return res.redirect('/register?registration=failed');
				} else {
					return res.redirect('/');
				}
			});
		}
	});
}

// LOGOUT
function logout(req, res, next) {
	req.session.destroy()
	req.logout()
	res.redirect('/')
}

module.exports = initRouter;
