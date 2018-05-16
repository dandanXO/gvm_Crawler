FORMAT: 1.0
# gvm crawler

## API說明
* ``clone``
* ``npm install`` 
* ``npm start`` 即可使用
* api url 網址為 http://test.com/api/資源名稱 
* token 放置在header為 Key:Authorization, value:Bearer __your token__

# 文章爬蟲
 
## 及時爬蟲 [/:category] 
 
### 及時爬出10筆資料 [GET]
* Parameters
    * category: e.g:`life` (required) 

* Response 200 (application/json)

        {
            "newTenArticle": [
                {
                    "articlePicture": "https://imgs.gvm.com.tw/upload/gallery/20180412/43800_02.jpg",
                    "getArticleUrl": "https://www.gvm.com.tw/article.html?id=43800",
                    "author": "test",
                    "articleTitle": "test",
                    "articleContent": " test",
                    "date": "2018-04-12",
                    "articleId": "43800"
                }
            ]
        }
* Response 404 (application/json)
 
        {     "error": {         "message": "Not found"     } }

OR
* Response 401 (application/json)
 
        {
            "error": "illegal category"
        }

## 預約爬蟲 [/:category/:time] 

### 預約爬出10筆資料 [GET] 
* Parameters
    * category: 
    * time: e.g:`2018-4-30 15:15:15` (required) 
    * 說明:預約的時間:年-月-日 時:分:秒
* Response 200 (application/json)

        {
            "crawlerStartTime": "2018-5-12 19:19:50"
        }
* Response 404 (application/json)
 
        {     "error": {         "message": "Not found"     } }



# 使用者取得token

## user [/user/signin]
### 取得token [POST] 
* Request (application/json)

        {
            "email":"test@test.com",
            "password":"test@test.com"
        }

* Response 200 (application/json)

        {
            "message": "signin seccful",
             "token":"eyJhbGciOiJIUzI1"
        }
### OR

* Response 200 (application/json)

        {
            "error": "The password is invalid or the user does not have a password."
        }

#  搜尋文章

## search [/search/:keyword/:quantity]
### 搜尋 [GET] 
* Parameters
    * keyword: e.g: `文章` (required)  
    * quantity:e.g: `50` (required,Int) 
* Response 200 (application/json)

        {
            "Article": [
                {
                    "url": "https://www.gvm.com.tw/article.html?id=43681",
                    "indexOfArticle": 1
                },
                {
                    "url": "https://www.gvm.com.tw/article.html?id=43161",
                    "indexOfArticle": 2
                },
                {
                    "url": "https://www.gvm.com.tw/article.html?id=43137",
                    "indexOfArticle": 3
                },
                {
                    "url": "https://www.gvm.com.tw/article.html?id=43252",
                    "indexOfArticle": 4
                },
                {
                    "url": "https://www.gvm.com.tw/article.html?id=43202",
                    "indexOfArticle": 5
                }
            ]
        }
* Response 404 (application/json)
 
        {     "error": {         "message": "Not found"     } }

# Group 重啟排程

## reStartSchedule [/restartschedule]
### 搜尋 [GET] 

* Response 200 (application/json)

        {
            "reStartSchedule": "no scheduleing"
        }


or
* Response 200 (application/json)

        {
            "reStartSchedule": 
            {
                "-LAJ9bXNyvf-PTN3i1aF": 
                {
                    "Classification": "international",
                    "ClassificationId": "2",
                    "date": "2018-04-17 23:50:25"
                }
            }
        }

* Response 404 (application/json)
 
        {     "error": {         "message": "Not found"     } }