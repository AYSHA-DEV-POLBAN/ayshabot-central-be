const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
dotenv.config()

module.exports = {
    rootPath : path.resolve(__dirname,'..'),
    jwtKey: process.env.SECRET
}
