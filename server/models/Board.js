const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var moment = require('moment');//get local time
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
 
const date = moment().format('YYYY-MM-DD HH:mm:ss');


const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true });
//아씨바 이거 쓰면개꿀인데

const Board = mongoose.model('Board', boardSchema)

module.exports = {Board}