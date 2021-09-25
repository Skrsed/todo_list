const express = require('express')
const router = express.Router()
const verify = require('./verifyToken')
const db = require('../models')
const models = db.sequelize.models
const jwt = require('jwt-decode')

router.get('/leaded', verify, async (req, res) => {
  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  const user_id = jwt(token).id

  const users = await models.User.findAll({
    where: {lead_id: user_id}
  })

  res.status(200).send(users)
})

module.exports = router
