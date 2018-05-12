const express = require('express')
const router = express.Router()
const schedule = require('node-schedule')
const firebase = require("firebase")

//firebase
const databse = firebase.database();

//timer
let timer

//middleware
const checkAuth = require('../../middleware/check-auth')
const checkCategory = require('../../middleware/check-category')

//functions
const functions = require('./functions')

//router 
router.get('/:category/:time', checkAuth, checkCategory, function (req, res) {
    const time = req.params.time
    const date = new Date(req.params.time)
    if (date == 'Invalid Date') {
        res.status(200).json({ error: "Invalid Date" })
        return
    }
    let category = req.params.category
    let categoryNumber = functions.categoryCoverToNumber(category)

    timer = schedule.scheduleJob(date, function () {
        functions.crawler(category, categoryNumber)
    })
    functions.restoreSchedule(category, categoryNumber, time)
    res.status(200).json({ "crawlerStartTime": req.params.time })
})

router.get('/:category', checkAuth, checkCategory, function (req, res, next) {
    const newTenArticle = []
    let category = req.params.category
    let categoryNumber = functions.categoryCoverToNumber(category)
    functions.crawler(category, categoryNumber)
        .then(function (allData) {
            res.status(200).json(allData)
        })

})



module.exports = router