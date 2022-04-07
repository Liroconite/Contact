const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'entretien'
})

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 
 
app.set('views',path.join(__dirname,'views'));
 
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 

app.get('/',(req, res) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Formulaire',
            users : rows
        });
    });
});
 
 
app.get('/contact',(req, res) => {
    res.render('contact', {
        title : 'Contact'
    });
});
 
app.post('/save',(req, res) => { 
    let data = {civilite: req.body.civilite, prenom: req.body.prenom, nom: req.body.nom, email: req.body.email, adresse: req.body.adresse, code_postal: req.body.code_postal, ville: req.body.ville, pays: req.body.pays, profession: req.body.profession, message: req.body.message};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});
 
app.get('/profile/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('profile', {
            title : 'Profile',
            user : result[0]
        });
    });
});
 
 
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 
 
// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});