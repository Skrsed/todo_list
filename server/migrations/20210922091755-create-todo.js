'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      due_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      priority: {
        allowNull: false,
        type: Sequelize.ENUM('high', 'middle', 'low'),
        defaultValue: 'middle'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('todo', 'doing', 'done', 'cancel'),
        defaultValue: 'todo'
      },
      creator_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      responsible_id: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('todos')
  }
}
