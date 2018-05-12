const express = require('express')
const router = express.Router()

//timer
let timer

//middleware
const checkAuth = require('../../middleware/check-auth')

//functions
const functions = require('./functions')

//router further
router.get('/', checkAuth, function (req, res, next) {
    functions.restart()
        .then(function (data) {
            res.status(200).json( data )

        })

})

module.exports = router