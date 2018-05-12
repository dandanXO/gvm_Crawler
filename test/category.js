const should = require('should')
const functions = require('../api/routes/category/functions')
const firebase = require("firebase")

describe('正確6個目錄的對應ID categoryCoverToNumber', function(){
    it('test chinaandtaiwan', function(done){
        let Id = functions.categoryCoverToNumber('chinaandtaiwan')
        Id.should.equal(3)
        done()
    })
    it('test currentaffairs', function(done){
        let Id = functions.categoryCoverToNumber('currentaffairs')
        Id.should.equal(1)
        done()
    })
    it('test education', function(done){
        let Id = functions.categoryCoverToNumber('education')
        Id.should.equal(5)
        done()
    })
    it('test finance', function(done){
        let Id = functions.categoryCoverToNumber('finance')
        Id.should.equal(4)
        done()
    })
    it('test international', function(done){
        let Id = functions.categoryCoverToNumber('international')
        Id.should.equal(2)
        done()
    })
    it('test life', function(done){
        let Id = functions.categoryCoverToNumber('life')
        Id.should.equal(6)
        done()
    })
})

describe('爬蟲測試 crawler',function (){
    it("輸入參數category和categoryNumber",function(done){
        let res  = functions.crawler('education', 5)
        res.should.be.json
        done()
       
    })
    
})

