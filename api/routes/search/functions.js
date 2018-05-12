const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const schedule = require('node-schedule')
const firebase = require("firebase")

module.exports = {
    search: function (keyWord, quantity) {
        return new Promise(function (resolve, reject) {
            const reg = /^\d+$/
            if (!reg.test(quantity)){
                console.log(quantity)
                resolve({"error":"Invalid Quantity"})  
            }
            const allData = []
            const options = {
                uri: 'https://www.gvm.com.tw/search.html?q=' + keyWord + '&sort=&page=1',
                transform: function (body) {
                    return cheerio.load(body)
                }
            }
            let Article = {}
            let numberOfArticle = ""
            rp(options)
                .then(function ($) {
                    const ArticleX = $('main .BreadCrumbs #search_info').contents().filter(function () {
                        return this.nodeType == 3
                    })
                        .text().indexOf("到")
                    const ArticleY = $('main .BreadCrumbs #search_info').contents().filter(function () {
                        return this.nodeType == 3
                    })
                        .text().indexOf("筆")
                    numberOfArticle = $('main .BreadCrumbs #search_info').contents().filter(function () {
                        return this.nodeType == 3
                    })
                        .text().substring(ArticleX, ArticleY).replace(/[^\d.-]/g, "")
                    if (quantity <= 0 || quantity > parseInt(numberOfArticle)) {
                        res.status(200).json({ "error": "超出數量", "總數": numberOfArticle })
                        return next()
                    }
                    return Math.ceil(parseInt(quantity) / 10)
                })
                .then(function (numberOfArticlePage) {
                    const promises = []
                    for (let i = 1; i <= numberOfArticlePage; i++) {

                        promises.push(rp('https://www.gvm.com.tw/search.html?q=' + keyWord + '&sort=&page=' + i)) // create a promise for each url and fire off the request
                    }
                    return Promise.all(promises)
                })
                .then(function (arrayOfResultsFromEachPreviousRequest) {
                    let indexOfArticle = 1
                    let Article = []
                    let lastArticleOfpageSnumber = (10 - (quantity % 10))
                    if (lastArticleOfpageSnumber === 10) {
                        lastArticleOfpageSnumber = 0
                    }
                    for (let i = 0; i < arrayOfResultsFromEachPreviousRequest.length; i++) {
                        const $ = cheerio.load(arrayOfResultsFromEachPreviousRequest[i])

                        if (i == arrayOfResultsFromEachPreviousRequest.length - 1) {
                            $('#article_list .list-row .row-right a').each(function (i, elem) {

                                if (!$(this).attr("href").match('tags')) {
                                    Article.push({ "url": $(this).attr("href"), indexOfArticle })
                                    indexOfArticle++

                                }
                            })
                            for (let j = 0; j < lastArticleOfpageSnumber; j++) {
                                Article.pop()
                            }
                            break
                        }
                        $('#article_list .list-row .row-right a').each(function (i, elem) {
                            if (!$(this).attr("href").match('tags')) {
                                Article.push({ "url": $(this).attr("href"), indexOfArticle })
                                indexOfArticle++
                            }
                        })
                    }
                    resolve(Article)


                })
                .catch(function (err) {
                    console.log(err)
                })
        })
    }
}