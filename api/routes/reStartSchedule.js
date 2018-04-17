const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const schedule = require('node-schedule')
const firebase = require("firebase")

//timer
let timer

//middleware
const checkAuth = require('../middleware/check-auth')

//router further
router.get('/', function (req, res, next) {
    const allData = []
    console.log("重起預約爬蟲")
    let currentDate = new Date
    firebase.database().ref('schedule/').orderByChild('date').once('value')
        .then(function (snapshot) {
            snapshot.forEach(datasOfOne => {
                console.log(datasOfOne.val())
                if (currentDate > new Date(datasOfOne.val().date)) {

                    firebase.database().ref('schedule/').child(datasOfOne.key).remove()
                } else {
                    timer = schedule.scheduleJob(datasOfOne.val().date, function () {
                        console.log("Start at" + currentDate)
                        const options = {
                            uri: 'https://www.gvm.com.tw/category.html?cg_no=' + datasOfOne.val().ClassificationId,
                            transform: function (body) {
                                return cheerio.load(body)
                            }
                        }
                        let getArticleUrl = []
                        rp(options)
                            .then(function ($) {
                                let getArticleUrl = []
                                $('#article_list .list-row .row-right a').each(function (i, elem) {
                                    if (!$(this).attr("href").match('tags')) {
                                        getArticleUrl.push($(this).attr("href"))
                                    }
                                })
                                //console.log(getArticleUrl)
                                return getArticleUrl
                            })
                            .then(function (getArticleUrl) {
                                const promises = []
                                for (let i = 0; i < getArticleUrl.length; i++) {
                                    //console.log(getArticleUrl[i])
                                    const option = {
                                        uri: getArticleUrl[i],
                                        transform: function (body) {
                                            return cheerio.load(body)
                                        }
                                    }
                                    promises.push(rp(getArticleUrl[i])) // create a promise for each url and fire off the request
                                }
                                return Promise.all(promises)
                            })
                            .then(function (arrayOfResultsFromEachPreviousRequest) {
                                for (let i = 0; i < arrayOfResultsFromEachPreviousRequest.length; i++) {
                                    const $ = cheerio.load(arrayOfResultsFromEachPreviousRequest[i])
                                    const articlePicture = $('.pc-bigArticle section .pc-article-pic-full img').attr("src")
                                    const articleTitle = $('.pc-bigArticle section h1').text()
                                    const author = $('.pc-bigArticle section h3 a').last().text()
                                    const articleContent = $('.pc-bigArticle .article-content').text().replace("\n", "").slice(0, 500)
                                    const date = $('.pc-bigArticle section h3').contents().filter(function () {
                                        return this.nodeType == 3
                                    })
                                        .text().replace(/[^\d.-]/g, "")
                                    const getArticleUrl = $('meta[property="og:url"]').attr('content')
                                    const articleId = $('meta[property="og:url"]').attr('content').replace(/[^\d]/g, "")
                                    // console.log(getArticleUrl)
                                    allData.push({
                                        articlePicture: articlePicture,
                                        getArticleUrl: getArticleUrl,
                                        author: author,
                                        articleTitle: articleTitle,
                                        articleContent: articleContent,
                                        date: date,
                                        articleId: articleId
                                    })
                                    firebase.database().ref(datasOfOne.val().Classification+'/').orderByChild("articleId").equalTo(allData[i].articleId).once("value", snapshot => {
                                        const articleId = snapshot.val()
                                        if (articleId) {
                                            //console.log("exists!")
                                        } else {
                                            firebase.database().ref(datasOfOne.val().Classification+'/').push(
                                                allData[i]
                                            )
                                        }
                                    })

                                }
                                //console.log(allData)
                            })
                    })
                }
            })
            //last check firebse data
            firebase.database().ref('schedule/').orderByChild('date').once('value')
                .then(function (snapshot) {
                    if (snapshot.val() == null) {
                        res.status(200).json({ reStartSchedule: "no scheduleing" })
                        return
                    } else {
                        res.status(200).json({ reStartSchedule: snapshot.val() })
                    }
                })
        })
        .catch(function (err) {
            console.log(err)
        })


})

module.exports = router