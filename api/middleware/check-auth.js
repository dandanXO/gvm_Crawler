const jwt = require('jsonwebtoken')
const jwt_config = require('../../config/Jwt_config')
module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, jwt_config.Jwt_sect)
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }



}