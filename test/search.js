const should = require('should')
const functions = require('../api/routes/search/functions')
const firebase = require("firebase")

describe('搜尋測試 search', function () {

    it('輸入參數keyWord和quantity', function (done) {
        let res  = functions.search('天才', 5)
        res.should.be.json
        done()
    })
    it('如果少輸入一個參數錯誤處理', function (done) {
        let res  = functions.search('天才', 5)
        res.should.be.json
        done()
    })
  
})


