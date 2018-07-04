
const firebase = require("firebase")
config = {
    apiKey: "",
    authDomain: "gvm-crawler.firebaseapp.com",
    databaseURL: "https://gvm-crawler.firebaseio.com",
    projectId: "gvm-crawler",
    storageBucket: "gvm-crawler.appspot.com",
    messagingSenderId: "960810433812"
}



module.exports = firebase.initializeApp(config)
