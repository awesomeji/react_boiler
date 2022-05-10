const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');//encrypt password
const saltRounds = 10;

var moment = require('moment');//get local time
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
 
const date = moment().format('YYYY-MM-DD HH:mm:ss');

const validator = require('validator'); //validate email
const { json } = require('express/lib/response');

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRATION_TIME } = process.env;

const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
    maxlength: 50,
},
userid: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true,
    unique: 1,
},
email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
    validate: {
        validator: validator.isEmail,
        message: '{VALUE} 은 정확한 이메일형식이아닙니다./'
    }
},
password: {
    type: String,
    required: true,

    validate: [
    function (password) {
        return password.length >= 8 &&
            password.length <= 20 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);;
    },
    '비밀번호는 8자리 이상 20자리 이하 영문 대,소문자와 특수문자, 숫자의 조합으로 입력해주세요./'
    ]
},
role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
},
token: {
    type: String
},
tokenExp: {
    type: Number
},
member_profile: {
    type: String,
    //for 
}
},{timestamps: true});

//encrypt password before saving to database using bcrypt
// and mongoose middleware (pre)
//https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre('save', function (next) {

    var user = this;

    // console.log(user);
    if (user.isModified('password')) {

        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
    
});

userSchema.statics.saveRefreshToken = function ( refreshToken, cb) { 
   
    // console.log(refreshToken);
    if (refreshToken) {
        // console.log(refreshPayload);
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        // console.log(decoded.id);
        // console.log(decoded.exp);
        User.findOneAndUpdate({ _id: decoded.id }, { $set: { token: refreshToken, tokenExp: decoded.exp } }, { new: true }, function (err, user) {
           
            if (err) return new Error(err);
            if (!user) return json.res(
                {
                    message: '유저가 존재하지 않습니다./'
                }
            );
            return true;
        });
        
    }
}



const User = mongoose.model('User', userSchema);

module.exports = {User}


