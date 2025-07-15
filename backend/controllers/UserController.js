const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const getToken = require('../helpers/get-token')
const jwt = require('jsonwebtoken')


module.exports = class UserController {
  static async registerNewUser(req, res) {
    const { name, email, phone, password, confirmPassword } = req.body

    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório' })
      return
    }
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório' })
      return
    }
    if(!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório' })
      return
    }
    if(!password) {
      res.status(422).json({ message: 'A senha é obrigatório' })
      return
    }
    if(!confirmPassword) {
      res.status(422).json({ message: 'A confrimação é obrigatório' })
      return
    }

    if(password !== confirmPassword) {
      res.status(422)
      .json({
        message: 'A senha e a confirmação de senha precisam ser iguais!'
      })
      return
    }

    const userExists = await User.findOne({email: email})

    if(userExists) {
      res.status(422)
      .json({
        message: 'Por favor, utilize outro email!'
      })
      return
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    })

    try {
      const newUser = await user.save()
      await createUserToken(newUser, req, res)
    } catch(err) {
      res.status(500).json({ message: err })
    }
  }

  static async userLogin(req, res) {
    const { email, password } = req.body

    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório' })
      return
    }

    if(!password) {
      res.status(422).json({ message: 'A senha é obrigatória' })
      return
    }

    const user = await User.findOne({email: email})
    if(!user) {
      res.status(422)
      .json({
        message: 'Não usuário cadastrado com este email'
      })
      return
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) {
      res.status(422).json({
        message: 'Senha inválida!',
      })
      return
    }

    await createUserToken(user, req, res)
  }

  static async checkingUserByToken(req, res) {
    let currentUSer

    if(req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 'nossosecret')

      currentUSer = await User.findById(decoded.id)

      currentUSer.password = undefined
    } else {
      currentUSer = null
    }

    res.status(200).send(currentUSer)
  }
}