// app.js
var express = require('express');
var app = express();

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDlsTPJpYG9KibHlXJWdBS83OjY8JqQ-pk",
    authDomain: "gvmtest-4cf0f.firebaseapp.com",
    databaseURL: "https://gvmtest-4cf0f.firebaseio.com",
    projectId: "gvmtest-4cf0f",
    storageBucket: "gvmtest-4cf0f.appspot.com",
    messagingSenderId: "118543686395"
  };
  firebase.initializeApp(config);


const bodyParser = require('body-parser')
var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');

// router
const currentAffairs = require('./api/routes/category/currentAffairs')
const chinaAnadTaiwan = require('./api/routes/category/chinaAndTaiwan')
const education = require('./api/routes/category/education')
const finance = require('./api/routes/category/finance')
const international =require('./api/routes/category/international')
const life = require('./api/routes/category/life')
const search = require('./api/routes/search')
const user = require('./api/routes/user/user')
//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// router set
app.use('/currentAffairs',currentAffairs);
app.use('/chinaAndTaiwan', chinaAnadTaiwan)
app.use('/education', education)
app.use('/finance', finance)
app.use('/international',international)
app.use('/life', life)
app.use('/search',search);
app.use('/user',user)

// errro control
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;