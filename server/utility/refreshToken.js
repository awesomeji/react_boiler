require('dotenv').config();
const express = require('express')
const { verifyToken } = require('./jwt')
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME,JWT_REFRESH_SECRET,JWT_REFRESH_EXPIRATION_TIME } = process.env;
const refreshToken = (req, res, next) => { 
    res.cookie('refreshToken', req, { httpOnly: true });
    next();
    
}

module.exports = { refreshToken };