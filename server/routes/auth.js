const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const verify = require('./verifyToken')
const {loginValidation} = require('../validation')
const db = require('../models')
const models = db.sequelize.models

router.post('/login', async (req, res) => {
  //validation
  const {error} = loginValidation(req.body)
  if (error) return res.status(400).json({message: error.details[0].message})

  // check user exists
  const user = await models.User.findOne({where: {login: req.body.login}})

  if (!user) return res.status(400).json({message: 'Пользователь не найден'})
  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password_hash)
  if (!validPass) return res.status(400).json({message: 'Неверный пароль'})
  // create and assign a token
  const token = jwt.sign(
    {
      id: user.id,
      surname: user.surname,
      firstname: user.firstName,
      patronymic: user.patronymic
    },
    process.env.SECRET_JWT_TOKEN
  )
  res.header('Token', token).send({token: token})
})

module.exports = router
