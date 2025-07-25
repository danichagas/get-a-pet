const jwt = require('jsonwebtoken')

const User = require('../models/User')
const {decode} = require("jsonwebtoken");

const getUserByToken = async (token) => {
    if(!token) {
        return res.status(401).json({ message: 'Acesso negado' })
    }

    const decoded = jwt.verify(token, 'nossosecret')

    const userId = decode.id

    const user = await User.findOne({ _id: userId })

    return user
}

module.exports = getUserByToken()