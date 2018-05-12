const firebase = require("firebase")
const jwt = require("jsonwebtoken")

//config
const JWTKEY = require('../../../config/Jwt_config')

module.exports = {
    signin: function (email, password) {
        return new Promise(function (resolve, reject) {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.uid
                    },
                       JWTKEY.Jwt_sect,
                        {
                            expiresIn: "365d"
                        })
                    resolve({
                        message: "signin seccful",
                        token: token
                    })
                })
                .catch(function (error) {
                    // Handle Errors 
                    console.log(error.message + error.code + error)
                    resolve({
                        message: error.message
                    })
                })
        })
    }
}