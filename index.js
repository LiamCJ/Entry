const SHA256 = require("crypto-js/sha256");
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// create mySQL connection
const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'users'
});

//connect to mySQL
db.connect((err) => {
	if(err){
		throw err;
	}
	console.log('mySQL Connected...');
});

// creating database
app.get('/createDataBase', (req, res) =>{
	let sqlCmd = 'CREATE DATABASE users';
	db.query(sqlCmd, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Database Created...');
	});
});

// creating table in database
app.get('/createTable', (req, res) =>{
	console.log("Connected");
	let sqlCmd = 'CREATE TABLE user( id int AUTO_INCREMENT, email varchar(500), password varchar(50), PRIMARY KEY(id))';
	db.query(sqlCmd, (err, result) => {
		if(err) throw err;
		console.log(result);
		res.send('Table Created...');
	});
}) 

//Set static folder
app.use(express.static(path.join( __dirname,'public')));

app.get('/entry', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'entry.html'));        
})

app.post('/entry', (req, res) => {
	const hash = SHA256(req.body.password);
	const encode = hash.toString(CryptoJS.enc.Base64);

	console.log(req.body.exists);

	if (!req.body.exists){
		let valueCheck = `SELECT EXISTS ( SELECT * FROM user WHERE email = '${req.body.email}' )`;
	
		db.query(valueCheck, (err, result) =>{
			if(err) throw err;

			if(result[0][valueCheck.substring(7)] == 1){
	
				let sqlCmd = `SELECT password FROM user WHERE email = '${req.body.email}'`
				db.query(sqlCmd, (err, passwordResult) => {
					if(err) throw err;
					if(passwordResult[0].password == encode){
						console.log("Logged In");
						res.status(200).send({message: "Welcome Back"})
					}else{
						console.log('Wrong Password');
						res.status(404).send({message: "Password Incorret"})
					}
				})
	
			}else{
				console.log("Doesnt Exists");
				res.status(400).send({message: "Email Does Not Exist, Would You Like To Register?"});
			}
		})

	}else {
		let data = {email: req.body.email, password: encode};
		let sqlCmd = 'INSERT INTO user SET ?';
		db.query(sqlCmd, data, (err, result) => {
			if(err) throw err;
			console.log("Added");
			res.status(201).send({message: "Welcome! Your Account Has Been Created"})
		})
	}

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started On Port ${PORT} \nCreate Database Go To: http://localhost:${PORT}/createDataBase\nCreate Table Go To: http://localhost:${PORT}/createTable\nGo To: http://localhost:${PORT}/entry`));