const should = require('should')
const functions = require('../api/routes/reStartSchedule/functions')
const firebase = require("firebase")

describe('重啟排成測試 restartschedule', function () {

    it('restart', function (done) {
        let res  = functions.restart().then(function (data) {
            data.should.be.json
        })
        done()
    })
  
})


