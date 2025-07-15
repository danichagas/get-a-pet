const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

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

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await User.findById(id).select('-password')

    if(!user) {
      res.status(422).json({
        message: 'Usuário não encontrado'
      })
      return
    }

    res.status(200).json({ user })
  }

  static async editUser(req, res) {
    const id = req.params.id

    const token = getToken(req)
    const user = await getUserByToken(token)

    const { name, email, phone, password, confirmPassword } = req.body

    let image = ''

    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório' })
      return
    }
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório' })
      return
    }

    const userExists = await User.findOne({ email: email })

    if(user.email !== email && userExists) {
      res.status(422).json({
        message: 'Por favor utilize outro email!'
      })
      return
    }

    user.email = email

    if(!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório' })
      return
    }

    user.phone = phone

    if(password != confirmPassword) {
      res.status(422).json({ message: 'As senha não conferem!' })
      return
    } else if(password == confirmPassword && password != null) {
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      user.password = passwordHash
    }

    try {

      await User.findByIdAndUpdate(
          { _id: user._id },
          { $set: user },
          {new: true},
      )

      res.status(200).json({
        message: 'Usuário atualizado com sucesso!'
      })

    } catch (err) {
      res.status(500).json({ message: err })
      return
    }
  }
}