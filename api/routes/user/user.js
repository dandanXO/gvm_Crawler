const express = require('express')
const router = express.Router()

const checkAuth = require('../../middleware/check-auth')

//functions
functions = require('./functions')

router.post('/signin', function (req, res, next) {
    const email = req.body.email
    const password = req.body.password
    functions.signin(email, password)
        .then(function (data) {
            res.status(200).json( data )
        })

})



module.exports = router