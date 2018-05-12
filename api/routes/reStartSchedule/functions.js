const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const schedule = require('node-schedule')
const firebase = require("firebase")

module.exports = {
    restart: function () {
        return new Promise(function (resolve, reject) {
            const allData = []
            let currentDate = new Date
            firebase.database().ref('schedule/').orderByChild('date').once('value')
                .then(function (snapshot) {
                    snapshot.forEach(datasOfOne => {

                        if (currentDate > new Date(datasOfOne.val().date)) {
                            firebase.database().ref('schedule/').child(datasOfOne.key).remove()
                        } else {
                            timer = schedule.scheduleJob(datasOfOne.val().date, function () {

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
                                        return getArticleUrl
                                    })
                                    .then(function (getArticleUrl) {
                                        const promises = []
                                        for (let i = 0; i < getArticleUrl.length; i++) {
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
                                            allData.push({
                                                articlePicture: articlePicture,
                                                getArticleUrl: getArticleUrl,
                                                author: author,
                                                articleTitle: articleTitle,
                                                articleContent: articleContent,
                                                date: date,
                                                articleId: articleId
                                            })
                                            firebase.database().ref(datasOfOne.val().Classification + '/').orderByChild("articleId").equalTo(allData[i].articleId).once("value", snapshot => {
                                                const articleId = snapshot.val()
                                                if (articleId) {
                                                } else {
                                                    firebase.database().ref(datasOfOne.val().Classification + '/').push(
                                                        allData[i]
                                                    )
                                                }
                                            })

                                        }
                                    })
                            })
                        }
                    })
                    //last check firebse data if need replace
                    firebase.database().ref('schedule/').orderByChild('date').once('value')
                        .then(function (snapshot) {
                            if (snapshot.val() == null) {
                                resolve( {"message":"no scheduleing"})
                                return
                            } else {
                               resolve(snapshot.val() )
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                })
                .catch(function (err) {
                    console.log(err)
                })
        })
    }
}