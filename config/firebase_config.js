
const firebase = require("firebase")
config = {
    apiKey: "AIzaSyAe0Nf23fdC34PqSNAauVz6s2JGgLK6DQg",
    authDomain: "gvm-crawler.firebaseapp.com",
    databaseURL: "https://gvm-crawler.firebaseio.com",
    projectId: "gvm-crawler",
    storageBucket: "gvm-crawler.appspot.com",
    messagingSenderId: "960810433812"
}



module.exports = firebase.initializeApp(config)