const express = require('express')
const router = express.Router()

//middleware
const checkAuth = require('../../middleware/check-auth')

//functions
const functions = require('./functions')


router.get('/:keyword/:quantity', checkAuth, function (req, res) {

    const keyWord = encodeURI(req.params.keyword)
    const quantity = req.params.quantity
    functions.search(keyWord, quantity)
        .then(function (data){
            res.status(200).json( data )
        
        })


})

module.exports = router