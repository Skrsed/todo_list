'use strict'

const faker = require('faker')

const db = require('../models')

const seed = {
  up: async (queryInterface, Sequelize) => {
    const users = await db.sequelize.models.User.findAll()
    const dataset = createToDos(users)

    return queryInterface.bulkInsert('todos', dataset)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('todos', null, {})
  }
}

const daysFromNow = (days) => {
  let date = new Date()
  date.setDate(date.getDate() + days)

  return date
}

const createToDos = (users) => {
  
  return [
    {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(12),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: new Date(),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(-3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[0].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(12),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[2].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: new Date(),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[3].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(-3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[4].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(12),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[4].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[3].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: new Date(),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[2].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: faker.git.commitMessage(),
      description: faker.lorem.paragraph(),
      due_date: daysFromNow(-3),
      priority: 'low',
      status: 'todo',
      creator_id: users[0].id,
      responsible_id: users[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

module.exports = seed
