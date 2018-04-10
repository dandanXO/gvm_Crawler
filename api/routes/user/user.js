const express = require('express')
const firebase = require("firebase")
const router = express.Router()
const jwt = require("jsonwebtoken")

const checkAuth = require('../../middleware/check-auth')



router.post('/signin', function (req, res, next) {

    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(function (user) {
            console.log(user.email)
            const token = jwt.sign({
                email: user.email,
                userId: user.uid
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                })
            res.status(201).json({
                message: "signin seccful",
                token: token
            })
        })
        .catch(function (error) {
            // Handle Errors 
            console.log(error.message + error.code + error)
            res.status(201).json({ "error": error.message })
        })

})



module.exports = router