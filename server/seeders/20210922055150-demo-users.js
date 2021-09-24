'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')
const db = require('../models')
faker.locale = "ru";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const test = await db.sequelize.models.User.findAll()

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('test', salt);

    return queryInterface.bulkInsert('users', [{
      firstName: faker.name.firstName(),
      surname: faker.name.lastName(),
      patronymic: faker.name.middleName(),
      login: 'test',
      password_hash: hashPassword,
      lead_id: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}