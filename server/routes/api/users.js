var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config(); //.env file is should be in root directory

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRATION_TIME } = process.env;
const bcrypt = require('bcrypt');

const { User } = require('../../models/User'); 
// const res = require('express/lib/response');
// const { redirect, append } = require('express/lib/response');


router.get('/auth', passport.authenticate('custom', { session: false }), (req, res) => { 
  
    if (req.user.nulltokenmessage) { 
        res.cookie('refreshToken', null, { httpOnly: true })
        return res.json({
             isAuth: false,
             message: req.user.nulltokenmessage
      });
    }
    if (req.user.refreshToken ) { 
        console.log('req.user.refreshToken : '+ req.user.refreshToken)
        res.cookie('refreshToken', req.user.refreshToken, { httpOnly: true })
    }
    res.json({
        isAuth:true,
        id : req.user.id,
        userid: req.user.userid,
        role: req.user.role,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
        
        
        // id: req.user.id,
    });
})


router.post('/register', (req, res) => {
 
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, error:err });
        return res.status(200).json({
            success: true,
            userData: doc
        });
    })
});
   
router.post('/login', (req, res) => { 
    const { userid, password } = req.body;
    console.log(userid, password);
    //find email
    User.findOne({ userid  })
        .then(user => {

            if (!user) {
                return res.json({
                loginSuccess: false,
                message: "ID not found"
                });
            }
        
    //compare password
    bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
            const accessPayload = {
                id: user.id,
                userid: user.userid,
                role: user.role
            };
            // console.log(accessPayload.id);
            const refreshPayload = {
                id: user.id
            }
            jwt.sign(accessPayload, JWT_ACCESS_SECRET, { expiresIn:  JWT_ACCESS_EXPIRATION_TIME}, (err, token) => {
        
            // res.cookie('accessToken', token, { httpOnly: true })
        const accessToken = 'Bearer ' + token
            jwt.sign(refreshPayload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION_TIME }, (err, refreshT) => {
            //note that maxAge is in milliseconds
                console.log('refreshToken : '+refreshT)
                res.cookie('refreshToken', refreshT, { httpOnly: true  })
                
                
            res.json({
                loginsuccess: true,
                accesPayload : accessPayload,
                accessToken: accessToken
            })
                User.saveRefreshToken(refreshT)
                //이거 모듈화 왜앙돼
        });
    });
            } else {
                return res.json({ loginSuccess: false, message: "Wrong password" });
            }
            })
        })
    .catch(err => console.log(err));

});

router.get('/logout', (req, res) => { 
    User.findOneAndUpdate({ id : req.id }, { token : null, tokenExp : null }, (err, doc) => { 
        if (err) return res.json({ success: false, error: err });
    })
    res.cookie('refreshToken', null, { httpOnly: true  })
    return res.status(200).json({
        logoutsuccess: true
    });
})


module.exports = router;