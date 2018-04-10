var express = require('express');
var app = express();
const router = express.Router();

var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
//timer
var timer ;
//middleware
const checkAuth = require('../../middleware/check-auth')

router.get('/:time',checkAuth,function(req,res){
    const allData = []
    console.log(req.params.time+"開始爬蟲")
    var date = new Date(req.params.time);
    timer = schedule.scheduleJob(date, function(){
         var options = {
        uri: 'https://www.gvm.com.tw/category.html?cg_no=6',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    let getArticleUrl = []
    rp(options)
        .then(function ($) {
            let getArticleUrl = []
            $('#article_list .list-row .row-right a').each(function(i, elem) {
                if( !$(this).attr("href").match('tags') ){
                    getArticleUrl.push($(this).attr("href"))
                }
              })
            //console.log(getArticleUrl)
            return getArticleUrl;
        })
        .then(function (getArticleUrl){
            var promises = [];
            for (var i = 0; i < getArticleUrl.length; i++) {
                //console.log(getArticleUrl[i])
                var option = {
                    uri: getArticleUrl[i],
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                }
                promises.push(rp(getArticleUrl[i])); // create a promise for each url and fire off the request
            }
            return Promise.all(promises); 
        }).then(function (arrayOfResultsFromEachPreviousRequest) {
            for (var i =0; i<arrayOfResultsFromEachPreviousRequest.length; i++){
                var $ = cheerio.load(arrayOfResultsFromEachPreviousRequest[i])
                var articlePicture = $('.pc-bigArticle section .pc-article-pic-full img').attr("src")
                var articleTitle = $('.pc-bigArticle section h1').text()
                var author = $('.pc-bigArticle section h3 a').last().text()
                var articleContent = $('.pc-bigArticle .article-content').text().replace("\n","").slice(0,500)
                var date = $('.pc-bigArticle section h3').contents().filter(function () {
                    return this.nodeType == 3;})
                    .text().replace(/[^\d.-]/g,"")
                var getArticleUrl = $('meta[property="og:url"]').attr('content')
                var articleId = $('meta[property="og:url"]').attr('content').replace(/[^\d]/g,"")
               // console.log(getArticleUrl)
                    allData.push({
                        articlePicture: articlePicture,
                        getArticleUrl: getArticleUrl,
                        author:author,
                        articleTitle:articleTitle,
                        articleContent:articleContent,
                        date:date,
                        articleId:articleId
                    })
            }
           
            console.log(allData)
            res.status(200).json({allData})
            timer.cancel()
        })
        .catch(function (err) {
            timer.cancel()
            console.log(err)
    });
 });
})

router.get('/',checkAuth,function(req,res){
    const allData = []
    console.log("開始爬蟲")
    var date = new Date(req.params.time);
   
         var options = {
        uri: 'https://www.gvm.com.tw/category.html?cg_no=6',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    let getArticleUrl = []
    rp(options)
        .then(function ($) {
            let getArticleUrl = []
            $('#article_list .list-row .row-right a').each(function(i, elem) {
                if( !$(this).attr("href").match('tags') ){
                    getArticleUrl.push($(this).attr("href"))
                }
              })
            //console.log(getArticleUrl)
            return getArticleUrl;
        })
        .then(function (getArticleUrl){
            var promises = [];
            for (var i = 0; i < getArticleUrl.length; i++) {
                //console.log(getArticleUrl[i])
                var option = {
                    uri: getArticleUrl[i],
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                }
                promises.push(rp(getArticleUrl[i])); // create a promise for each url and fire off the request
            }
            return Promise.all(promises); 
        }).then(function (arrayOfResultsFromEachPreviousRequest) {
            for (var i =0; i<arrayOfResultsFromEachPreviousRequest.length; i++){
                var $ = cheerio.load(arrayOfResultsFromEachPreviousRequest[i])
                var articlePicture = $('.pc-bigArticle section .pc-article-pic-full img').attr("src")
                var articleTitle = $('.pc-bigArticle section h1').text()
                var author = $('.pc-bigArticle section h3 a').last().text()
                var articleContent = $('.pc-bigArticle .article-content').text().replace("\n","").slice(0,500)
                var date = $('.pc-bigArticle section h3').contents().filter(function () {
                    return this.nodeType == 3;})
                    .text().replace(/[^\d.-]/g,"")
                var getArticleUrl = $('meta[property="og:url"]').attr('content')
                var articleId = $('meta[property="og:url"]').attr('content').replace(/[^\d]/g,"")
               // console.log(getArticleUrl)
                    allData.push({
                        articlePicture: articlePicture,
                        getArticleUrl: getArticleUrl,
                        author:author,
                        articleTitle:articleTitle,
                        articleContent:articleContent,
                        date:date,
                        articleId:articleId
                    })
            }
           
            //console.log(allData)
            res.status(200).json({allData}) 
        })
        .catch(function (err) {
            console.log(err)
    });
})

module.exports = router;