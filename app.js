// app.js
const express = require('express')
const app = express()

const firebase = require("firebase")
config = {
    apiKey: "AIzaSyAe0Nf23fdC34PqSNAauVz6s2JGgLK6DQg",
    authDomain: "gvm-crawler.firebaseapp.com",
    databaseURL: "https://gvm-crawler.firebaseio.com",
    projectId: "gvm-crawler",
    storageBucket: "gvm-crawler.appspot.com",
    messagingSenderId: "960810433812"
}
firebase.initializeApp(config)


const bodyParser = require('body-parser')
const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const schedule = require('node-schedule')

// router
const router = require('./router')

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes which should handle requests
app.use('/api/currentaffairs', router.currentAffairs)
app.use('/api/chinaandtaiwan', router.chinaAnadTaiwan)
app.use('/api/education', router.education)
app.use('/api/finance', router.finance)
app.use('/api/international', router.international)
app.use('/api/life', router.life)
app.use('/api/search', router.search)
app.use('/user', router.user)

// errro control
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app