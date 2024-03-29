const express = require('express')
const router = express.Router()
const verify = require('./verifyToken')
const db = require('../models')
const models = db.sequelize.models
const {Sequelize} = require('sequelize')
const jwt = require('jwt-decode')
const {todoValidation} = require('../validation')
const moment = require('moment')

const getGropedByDate = async (userId) => {
  const caseToday =
    "CASE WHEN due_date <= (date_trunc('day', NOW()) + '1 day'::interval - '1 second'::interval) THEN 'today'"
  const caseWeek = `WHEN due_date <= (date_trunc('day', NOW()) + '7 day'::interval - '1 second'::interval) THEN 'week'`
  const caseOther = "ELSE 'more_than_week' END"
  const data = await models.Todo.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'due_date',
      'priority',
      'status',
      'responsible_id',
      [Sequelize.literal(`${caseToday} ${caseWeek} ${caseOther}`), 'group']
    ],
    where: {responsible_id: userId},
    include: [
      {
        model: models.User,
        responsible_id: 1
      }
    ],
    order: [Sequelize.literal('"Todo"."due_date" ASC')],
    raw: true,
    nest: true
  })

  return data
}

const getGropedByResponsible = async (userId) => {
  const group = `concat_ws(' ', "User"."surname", "User"."firstName", "User"."patronymic")`
  const data = await models.Todo.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'due_date',
      'priority',
      'status',
      'responsible_id',
      [Sequelize.literal(group), 'group']
    ],
    include: [
      {
        model: models.User,
        where: {lead_id: userId},
        responsible_id: 1
      }
    ],
    order: [Sequelize.literal('"group" ASC')],
    raw: true,
    nest: true
  })

  return data
}

const aggregateData = (items) => {
  if (!items) return []

  const groups = items.reduce((acc, current) => {
    if (acc.length === 0 || !acc.find((x) => x.groupTitle === current.group)) {
      return [...acc, {groupTitle: current.group, children: [current]}]
    }

    acc[acc.length - 1].children.push(current)

    return acc
  }, [])

  return groups
}

router.get('/', verify, async (req, res) => {
  const group = req.query.group

  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  const userId = jwt(token).id

  if (userId && group === 'by_date') {
    const data = await getGropedByDate(userId)

    return res.status(200).send(aggregateData(data))
  }

  if (userId && group === 'by_responsible') {
    const data = await getGropedByResponsible(userId)

    return res.status(200).send(aggregateData(data))
  }

  const data = await models.Todo.findAll({
    include: [
      {
        model: models.User,
        responsible_id: 1
      }
    ],
    order: [Sequelize.literal('"Todo"."updatedAt" DESC')]
  })

  res.status(200).send(data)
})

router.post('/', verify, async (req, res) => {
  const {error} = todoValidation({
    title: req.body.title,
    due_date: req.body.due_date,
    description: req.body.description
  })

  if (error) return res.status(400).json({message: error.details[0].message})

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
    updatedAt: new Date()
  })

  res.status(200).send(todo)
})

router.put('/', verify, async (req, res) => {
  const {error} = todoValidation({
    title: req.body.title,
    due_date: req.body.due_date,
    description: req.body.description
  })

  if (error) return res.status(400).json({message: error.details[0].message})

  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  const user_id = jwt(token).id

  const todo = await models.Todo.findOne({where: {id: req.body.id}})

  const user = await models.User.findOne({where: {id: user_id}})

  const disabledFrilds = ['title', 'description', 'due_date', 'priority', 'responsible_id']

  const hasForbidden = disabledFrilds.find(key => {
    if (key === 'due_date') {
      return moment(todo[key]).format('DD/MM/YYYY') !== moment(req.body[key]).format('DD/MM/YYYY')
    }
    return todo[key] !== req.body[key]
  })

  if (hasForbidden && user.lead_id === todo.creator_id) {
    return res.status(400).json({message: "Вы можете изменить только статус"})
  }


  todo.title = req.body.title,
  todo.description = req.body.description
  todo.due_date = req.body.due_date
  todo.status = req.body.status
  todo.priority = req.body.priority
  todo.responsible_id = req.body.responsible_id

  res.status(200).send(await todo.save())
})

module.exports = router
