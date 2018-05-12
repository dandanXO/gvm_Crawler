const should = require('should')
const checkCaytegory = require('../api/middleware/check-category')
const request = require('supertest')

describe('loading express', function () {
    let server
    beforeEach(function () {
        server = require('../bin/www')
    })
    afterEach(function () {
        server.close()
    })

    it('responds to /user/signin', function userSignin(done) {
        request(server)
            .post('/user/signin')
            .expect(200)
            done()
        
    })
    it('get 404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done)
    })
    it('post 404 everything else', function testPath(done) {
        request(server)
            .post('/foo/bar')
            .expect(404, done)
    })
})


