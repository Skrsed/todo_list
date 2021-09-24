'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      surname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      patronymic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      login: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lead_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
}