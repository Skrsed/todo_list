'use strict'

const faker = require('faker')
const bcrypt = require('bcryptjs')
const db = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await db.sequelize.models.User.findOne()

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash('test2', salt)

    const dataset = []
    for (let i = 0; i < 6; i++) {
      dataset.push({
        firstName: faker.name.firstName(),
        surname: faker.name.lastName(),
        patronymic: faker.name.middleName(),
        login: faker.helpers.userCard().username,
        password_hash: 'deadHash',
        lead_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    dataset.push({
      firstName: faker.name.firstName(),
      surname: faker.name.lastName(),
      patronymic: faker.name.middleName(),
      login: 'test2',
      password_hash: hashPassword,
      lead_id: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return queryInterface.bulkInsert('users', dataset)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
