const express = require('express')
const router = express.Router();
const verify = require('./verifyToken')
const db = require('../models')
const models = db.sequelize.models
const { Sequelize } = require('sequelize')
const jwt = require('jwt-decode')

const getGropedByDate = async (userId) => {
  const caseToday = "CASE WHEN due_date <= (NOW() + '1 day'::interval) THEN 'today'"
  const caseWeek = `WHEN due_date BETWEEN NOW() + '1 day'::interval AND NOW() + '7 day'::interval THEN 'week'`
  const caseOther = "ELSE 'more_than_week' END"
  const data = await models.Todo.findAll({
    attributes: [
      'title', 'description', 'due_date', 'priority', 'status',
      [Sequelize.literal(`${ caseToday } ${ caseWeek } ${ caseOther }`), 'group'],
    ],
    where: { responsible_id : userId },
    include: [{
      model: models.User,
      responsible_id: 1
    }],
    order: [
      Sequelize.literal('"Todo"."due_date" ASC')
    ]
  })

  return data
}

const getGropedByResponsible = async (userId) => {
  const group = `concat_ws(' ', "User"."surname", "User"."firstName", "User"."patronymic")`
  const data = await models.Todo.findAll({
    attributes: [
      'title', 'description', 'due_date', 'priority', 'status',
      [Sequelize.literal(group), 'group'],
    ],
    include: [{
      model: models.User,
      where: { lead_id : userId },
      responsible_id: 1
    }],
    order: [
      Sequelize.literal('"group" ASC')
    ]
  })

  return data
}

router.get('/', verify, async(req, res) => {
  const group = req.query.group

  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  const userId = jwt(token).id

  if (userId && group === 'by_date') {

    const data = await getGropedByDate(userId)

    return res.status(200).send({ collection_type: 'grouped', data: data })
  }

  if(userId && group === 'by_responsible') {

    const data = await getGropedByResponsible(userId)

    return res.status(200).send({ collection_type: 'grouped', data: data })
  }

  const data = await models.Todo.findAll({
    include: [{
      model: models.User,
      responsible_id: 1
    }],
    order: [
      Sequelize.literal('"Todo"."updatedAt" DESC')
    ]
  })

  res.status(200).send({ collection_type: 'ungrouped', data: data })
})

router.post('/', verify, async(req, res) => {
  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  const user_id = jwt(token).id

  const todo = await models.Todo.create({
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date,
    priority: req.body.priority,
    status: req.body.status,
    creator_id: user_id,
    responsible_id: req.body.responsible_id,
    updatedAt: (new Date())
  })
  
  res.status(200).send(todo)
})

router.put('/', verify, async(req, res) => {

})

module.exports = router