# 目錄結構
```
|-- gvmCrawler
    |-- .gitignore
    |-- app.js
    |-- package-lock.json
    |-- package.json
    |-- router.js
    |-- .ebextensions
    |   |-- nodecommand.config
    |-- api
    |   |-- middleware
    |   |   |-- check-auth.js
    |   |   |-- check-category.js
    |   |-- routes
    |       |-- category
    |       |   |-- crawler.js
    |       |   |-- functions.js
    |       |-- reStartSchedule
    |       |   |-- functions.js
    |       |   |-- reStartSchedule.js
    |       |-- search
    |       |   |-- functions.js
    |       |   |-- search.js
    |       |-- user
    |           |-- functions.js
    |           |-- user.js
    |-- bin
    |   |-- www
    |-- config
    |   |-- firebase_config.js
    |   |-- Jwt_config.js
    |-- docs
    |   |-- api document.md
    |   |-- environment.md
    |   |-- gvm-crawler database.pdf
    |   |-- software architecture.md
    |-- test
        |-- category.js
        |-- reStartSchedule.js
        |-- search.js
        |-- serverAnduser.js
```
# 結構說明

## `package-lock.json & package.json`
前者記錄較詳細的modules變動過程後者為簡單紀錄modules的使用。

## `.gitignore` 
忽略版控的檔案

## `app.js & bin & router.js`
1. `app.js` 為程式主要檔案包含了錯誤控制，應用程式級middleware，主要的router分配。
2. `bin/www` 是程式進入點，包含debug的顯示選項。
3. `router.js` 記錄所有主router的路徑。

##  `.ebextensions/nodecommand.config`

nodecommand.config為發布至aws時使用express的設定檔，可以參考環境建置檔案。

## `/api`
此資料夾為主要api功能與附屬路徑的編輯。

1. middleware資料夾放置router等級的middleware。
2. routes包含所有功能路徑方法與邏輯，並將路徑與邏輯分開。每一個api功能，都有自己`functions.js`將邏輯寫入，與路徑方法分開。

## `/config`
此資料夾包含所有初始需要設定的資料，例如: `firebase`設定與`jwt`設定等。

## `/docs`
此資料夾包含所有說明文件。

## `/test`
包含所有單元測試的程式與邏輯，使用`npm install macho -g`安裝之後，使用`mocha`即可使用。



