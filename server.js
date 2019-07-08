require('dotenv').config();
const express = require('express');
var cookieParser = require('cookie-parser');
// var uuid = require('uuid');

const dns = require('dns');
const path = require('path');
var mysql = require('mysql');


const { URL } = require('url');
const { MongoClient } = require('mongodb');
const nanoid = require('nanoid');
var session = require('express-session')

const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

//creating uuid
const uuid = require('uuidv4');




//mysql  database connection
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "test",
	database: "login"
});
con.connect();
console.log("connected");
const databaseUrl = process.env.DATABASE;

const app = express();

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))    //session cookie
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
/*static middleware checks for particular directory & if its present it gives o/p*/
app.use(express.static('public'))


// Access the session as req.session

app.get('/', function (req, res, next) {                     //handler for '/'
	if (req.session.username && req.session.password) {
		console.log("abcd" + req.session.user);
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/index.html')
	} else {
		console.log('logelse');
		res.redirect('/login')
	}
})

app.get('/login', function (req, res, next) {          //handler for '/login'
	if (req.session.user) {
		res.redirect('/')
	} else {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/login.html')
	}
});
app.get('/register', function (req, res, next) {          //handler for '/login'
	if (req.session.user) {
		res.redirect('/')
	} else {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/register.html')
	}
});

app.get('/forgot', function (req, res, next) {          //handler for '/forgot'
	if (req.session.user) {
		res.redirect('/reset') //or email page
	} else {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/forgot.html')
	}
});


app.get('/link', function (req, res, next) {          //handler for '/forgot'
	if (req.session.user) {
		res.redirect('/reset') //or email page
	} else {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/link.html')
	}
});

app.get('/reset/:uuid', function (req, res, next) {          //handler for '/reset'
	//  const uuid = req.params.uuid;
	//  const uuid = req.session.uuid;

	//set uuid in session
	if (req.session.uuid) {
		console.log("session set for uuid")
		// res.redirect('/login')
	} else {
		res.setHeader('Content-Type', 'text/html')
		res.sendFile(__dirname + '/public' + '/reset.html')
	}
});

app.delete('/logout', function (req, res, ) {
	req.session.destroy(function (err) {
		res.send({
			success: true
		});
	});
});
//register database
app.post('/register', function (request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var sql = "INSERT INTO logins (username,password,Uuid) VALUES (?,MD5(?),uuid())";
	con.query(sql, [username, password], function (error, results, fields) {
		if (error) {
			console.error(error);
			response.status(400).send("Invalid username and password");
		} else {
			console.log(request.body.username);
			response.send({
				success: true
			}).end();
		}
	});
});

//database login
app.post('/login', function (request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM logins WHERE username = ? AND password = MD5(?)',
			[username, password], function (error, results, fields) {
				if (results.length > 0) {
					request.session.username = username;
					request.session.password = password;
					response.status(200).send({
						// username: "pavithra",
						// password: "xxceed"
						success: true

					});
				} else {
					response.status(402).send({
						error: true,
						message: 'Incorrect Username or Password'
					});
					response.end();
				}
			});
	} else {
		console.log("database");
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.post('/forgot', function (request, response) {
	console.log(request.body.username);
	console.log(request.body.email);
	var gen = uuid();
	var username = request.body.username;
	var email = request.body.email;
	console.log(gen);

	con.query('SELECT * FROM logins WHERE username = ?', [username], function (error, results, fields) {
		if (results.length > 0) {
			request.session.username = username;

			var sql = "UPDATE logins SET Email = ?, Uuid = ? WHERE username = ?";
			con.query(sql, [email, gen, username], function (error, results, fields) {

				if (error) {
					console.error(error);
					response.status(400).send({
						error: true,
						message: 'enter proper email'
					});
				} else {
					const link = "http://localhost:4500/reset/" + gen;
					console.log(link);
					response.send({
						success: true
					});
					response.end();
				}
			});
		} else {
			response.status(402).send({
				error: true,
				message: 'Username not found'
			});
			response.end();
		}
	});

});




app.post('/link', function (request, response) {

	response.send('Link sent');
});




// app.post('/forgot', function (req, res, next) {
// 	//to check if username exists in database   
// 	// let username = req.body.username;
// 	 var email = request.body.email;
// 	// var uuid = request.body.uuid;
// 	// con.query('SELECT * FROM logins WHERE username = ?',
// 	// 	[username], function (error, results, fields) {
// 	// 		if (error) {
// 	// 			console.error('Error while fetching row', error);
// 	// 			return res.status(500).json({ error: true, message: "Unable to process" });
// 	// 		}
// 			console.log("Forgot check:", results);

// 			var sql = "INSERT INTO logins (Email) VALUES (?)";
// 			con.query(sql, [Email], function (error, results, fields) {
// 				if (error) {
// 					console.error(error);
// 					response.sendStatus(400).send("Invalid email");
// 				} else {
// 					console.log(request.body.username);
// 					response.send({
// 						success: true
// 					}).end();
// 			}				
// 			});



//set email in db
//create uuid and set uuid in db
//create the link and print
//if user found.
// const link = "http://localhost:4500/reset-password/"+uuid;
// console.log("from email=" + email);
// if (results.length > 0) {
// 	res.json({ success: true, message: "User found" })
// } else {
// 	return res.status(404).json({ error: true, message: "User not found" });
// }


// app.post('/email', function (req, res) {
// 	var email = request.body.email;

// 	// create uuid

// 	// create a link

// 	// const link = "http://localhost:4500/reset-password/"+uuid;
// 	// console.log(link);
// 	console.log("from email=" + email);
// 	res.end("yes");
// });


// async..await is not allowed in global scope, must use a wrapper
async function main() {
	// create reusable transporter object using the default SMTP transport
	// let transporter = nodemailer.createTransport({
	// var transporter = nodemailer.createTransport(smtpTransport({
	// 	service: 'gmail',
	// 	host: 'smtp.gmail.com',
	// 	// secure: false, // true for 465, false for other ports
	// 	auth: {
	// 		user: 'pavithramurthy@gmail.com', // generated ethereal user
	// 		pass: 'paviammu1995' // generated ethereal password
	// 	}
	// }));
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // use TLS
		auth: {
			user: 'pavithramurthy@gmail.com', // generated ethereal user
			pass: 'paviammu1995' // generated ethereal password
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		}
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Pavithra" <pavithramurthy135@gmail.com>', // sender address
		to: "pavithra@xxceed.com", // list of receivers
		subject: "Test mail", // Subject line
		text: "Hello world?", // plain text body
		html: "<b>Hello world?</b>" // html body
	});
	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);

// database reset
app.post('/reset/:uuid', function (request, response) {
	//read uuid from session
	const uuid = request.params.uuid;
	var newpassword = request.body.newpassword;
	var confirmpassword = request.body.confirmpassword;
	if (newpassword !== confirmpassword) return response.status(422).send({
		error: true,
		message: 'passwords do not match'
	});

	var reset = "UPDATE logins SET password = MD5(?) where Uuid = ?";
	console.log(request.body, uuid);

	con.query(reset, [newpassword, uuid], function (error, results, fields) {
		if (error) {
			console.error(error);
			response.status(400).send("Please check your password");
		} else {
			response.send({
				success: true
			}).end();
		}
	});
});


// })

//setting a cookie

// app.get('/set/get', function (req, res) {
// 	res.cookie('color', 'red').send("Color :  ", req.cookies); 
//setting a cookie & getting response in req.cookies
// });

MongoClient.connect(databaseUrl, { useNewUrlParser: true })
	.then(client => {
		app.locals.db = client.db('shortener');
	})
	.catch(() => console.error('Failed to connect to the database'));

const shortenURL = (db, url) => {
	const shortenedURLs = db.collection('shortenedURLs');
	return shortenedURLs.findOneAndUpdate({ original_url: url },
		{
			$setOnInsert: {
				original_url: url,
				short_id: nanoid(7),
			},
		},
		{
			returnOriginal: false,
			upsert: true,
		}
	);
};
const checkIfShortIdExists = (db, code) => db.collection('shortenedURLs')
	.findOne({ short_id: code });

//reading a cookie from client side
// app.use(cookieParser());
// app.use(function(req, res, next){
//     const { name } = req.cookies;
//     console.log(name);
// }); 
//
// app.get('/', function (req, res) {
// 	// console.log(res.headersSent); // false
// 	res.send('OK');
// 	console.log(res.headersSent); // true
//   });

app.post('/new', (req, res) => {
	let originalUrl;
	try {
		originalUrl = new URL(req.body.url);
	} catch (err) {
		return res.status(400).send({ error: 'invalid URL' });
	}

	dns.lookup(originalUrl.hostname, (err) => {
		if (err) {
			return res.status(404).send({ error: 'Address not found' });
		};
		const { db } = req.app.locals;
		shortenURL(db, originalUrl.href)
			.then(result => {
				const doc = result.value;
				res.json({
					original_url: doc.original_url,
					short_id: doc.short_id,
				});
			})
			.catch(console.error);
	});
});

app.get('/short/:short_id', (req, res) => {
	const shortId = req.params.short_id;

	const { db } = req.app.locals;
	checkIfShortIdExists(db, shortId)
		.then(doc => {
			if (doc === null)
				return res.send('Uh oh. We could not find a link at that URL');

			res.redirect(doc.original_url)
		})
		.catch(console.error);
});
console.log("port");
app.set('port', process.env.PORT || 4500);
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});




