// app.js
var express = require('express');
var app = express();
const router = express.Router();

var rp = require('request-promise');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
//middleware
const checkAuth = require('../middleware/check-auth')


router.get('/:keyword/:quantity',checkAuth,function(req,res){
    const allData = []
    var keyWord = encodeURI(req.params.keyword)
    var quantity = req.params.quantity
    //console.log(quantity)
         var options = {
        uri: 'https://www.gvm.com.tw/search.html?q='+keyWord+'&sort=&page=1',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    let Article = {}
    var numberOfArticle=""
    rp(options)
        .then(function ($) {   
            var ArticleX = $('main .BreadCrumbs #search_info').contents().filter(function () {
                return this.nodeType == 3;})
                .text().indexOf("到")
            var ArticleY = $('main .BreadCrumbs #search_info').contents().filter(function () {
                return this.nodeType == 3;})
                .text().indexOf("筆")
            numberOfArticle = $('main .BreadCrumbs #search_info').contents().filter(function () {
                return this.nodeType == 3;})
                .text().substring(ArticleX,ArticleY).replace(/[^\d.-]/g,"")
            if(quantity<=0 || quantity>parseInt(numberOfArticle)){
                res.status(200).json({"error":"超出數量","總數":numberOfArticle})
                return  next()
            }  
            //console.log(Math.ceil(parseInt(quantity)/10))
            return Math.ceil(parseInt(quantity)/10)
        })
        .then(function (numberOfArticlePage){
            console.log(Math.ceil(numberOfArticlePage))
            var promises = [];
            for (var i = 1; i <= numberOfArticlePage; i++) {
               
                promises.push(rp('https://www.gvm.com.tw/search.html?q='+keyWord+'&sort=&page='+i)); // create a promise for each url and fire off the request
            }
            return Promise.all(promises); 
        })
        .then(function (arrayOfResultsFromEachPreviousRequest){ 
                var indexOfArticle = 1
                let Article = []
                var lastArticleOfpageSnumber=((numberOfArticle-quantity)%10)
                for (var i =0; i<arrayOfResultsFromEachPreviousRequest.length; i++){
                    var $ = cheerio.load(arrayOfResultsFromEachPreviousRequest[i])

                    if ( i == arrayOfResultsFromEachPreviousRequest.length-1){
                        $('#article_list .list-row .row-right a').each(function(i, elem) {

                            if( !$(this).attr("href").match('tags') ){
                                Article.push({"url": $(this).attr("href"),indexOfArticle})
                                indexOfArticle++
                            
                            }
                        })
                        for(var j = 0 ; j<lastArticleOfpageSnumber ; j++){
                            Article.pop()
                        }
                          break
                    }
                    $('#article_list .list-row .row-right a').each(function(i, elem) {
                        if( !$(this).attr("href").match('tags') ){
                            Article.push({"url": $(this).attr("href"),indexOfArticle})
                            indexOfArticle++
                        }
                      })
                }
                res.status(200).json({Article})
            
        })
        .catch(function (err) {
            console.log(err)
    });
})

module.exports = router;