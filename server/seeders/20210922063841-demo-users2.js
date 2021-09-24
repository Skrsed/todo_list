'use strict'

const faker = require('faker')

const db = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await db.sequelize.models.User.findOne()

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
        }
      )
    }

    return queryInterface.bulkInsert('users', dataset)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
