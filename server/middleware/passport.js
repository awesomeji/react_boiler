require('dotenv').config();

const { append } = require('express/lib/response');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const { verifyToken } = require('../utility/jwt');


const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRATION_TIME } = process.env;


module.exports = custom => {
    custom.use('custom', new CustomStrategy(
    function (req, done) {
    const split = req.headers.authorization.split(' ');
    const reqAcToken = split[1];
    const reqRfToken = req.cookies['refreshToken'];
     
    const isAccessValid = verifyToken('access', reqAcToken);
    const isRefreshValid = verifyToken('refresh', reqRfToken);

    //when access token isn't valid or exist.        
    if (!isAccessValid ||!reqAcToken) {
        
        //check refresh token is valid
        if (isRefreshValid) {
         // if it is , then re-issue access token by ID from refresh token
        // and re-issue refresh token too for secure reason
            console.log(isRefreshValid)
            User.findById({ _id: isRefreshValid.id }, (err, user) => {
                if (err) {
                    console.log(err)
                }
                const Payload = {
                    id: user.id,
                    userid: user.userid,
                    role: user.role
                }
                const userInfo = user.toObject()
                userInfo.id = user.id.toString()
                jwt.sign({ id: Payload.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION_TIME }, (err, refreshToken) => { 
                    if (err) {
                            console.log(err)
                    }
                    userInfo.refreshToken = refreshToken
                    User.saveRefreshToken(refreshToken)
                    
                })
                jwt.sign(Payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION_TIME }, (err, accessToken) => {
                    
                    
                    userInfo.accessToken = 'Bearer ' +  accessToken
                    
                    return done(null, userInfo)
                })
            })
        } else { 
            //if refresh token also isn't valid, which means both token aren't valid ,then return error
            return done(null, { nulltokenmessage: 'No token provided' });
        }
    
    } else {
        
        if (isRefreshValid) {

            //when both taken are valid return user info
            User.findById(isAccessValid.id)
                .then(user => {
                    if (user) {
                        console.log('user : ' + user)
                        return done(null, user)
                    }
                })
                .catch(err => console.log(err));
        } else { 
            //when access token is valid but refresh token isn't, then re-issue refresh token and return user info
            User.findById(isAccessValid.id)
                .then(user => { 
                    jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION_TIME }, (err, refreshToken) => {
                        if (err) {
                            console.log(err)
                        }
                        user.id = user.id.toString()
                        user.refreshToken = refreshToken
                        User.saveRefreshToken(refreshToken)
                        return done(null, user)
                    }
                )})
        }
    }
    
}))}

