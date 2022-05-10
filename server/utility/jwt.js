const mongoose = require('mongoose');
const { User } = require('../models/User'); 
const jwt = require('jsonwebtoken'); //...
const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRATION_TIME } = process.env;
require('dotenv').config();


module.exports = {
    
    verifyToken(type,token) {
        try { if (type === 'access') { 

             return jwt.verify(token, JWT_ACCESS_SECRET);
        } else if (type === 'refresh') {
     
       
            return jwt.verify(token, JWT_REFRESH_SECRET)
            
        } }
    
        catch (e) { /** * 다음과 같은 형태로 특정 에러에 대해서 핸들링해줄 수 있다.
        * */
            if (e.name === 'TokenExpiredError') {
           
             return null}
            return null
        } } }

