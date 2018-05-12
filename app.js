// app.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//config
const firebase_config = require('./config/firebase_config')

// router
const router = require('./router')

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 

//Routes which should handle requests
app.use('/api/crawler',router.crawler)
app.use('/api/search', router.search)
app.use('/user', router.user)
app.use('/api/restartschedule',router.reStartSchedule)

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