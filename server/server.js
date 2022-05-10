
const express = require('express');
const passport = require('passport');
const app = express();
const cookieparser = require('cookie-parser');  
const users = require('./routes/api/users');
const board = require('./routes/api/board');
const mongoose = require('mongoose');
var cors = require('cors')
app.use((cors({ origin: 'http://localhost:3000',  credentials: true })));
app.set('trust proxy', 1);

app.use(express.urlencoded( {extended : false } ));// bodyparser
app.use(express.json()); // bodyparser
app.use(passport.initialize());

app.use(cookieparser());



//2way to control enviroment variables
// const config = require('./config/key');

require('dotenv').config(); //.env file is should be in root directory
const { PORT, MONGO_URI } = process.env;
const port = PORT || 5000;




mongoose.connect(MONGO_URI
).then(() => { console.log('Connected to MongoDB') })
.catch(err => console.log(err));
// { useNewUrlParser: true } is no longer supported from mongoose >=6.0

// 패스포트 모듈 설정
require('./middleware/passport')(passport);


// 라우팅 파트
app.use('/api/users', users);
app.use('/api/board', board);




app.listen(port,() => console.log('This app listening at http://localhost:' + port));




