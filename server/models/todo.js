'use strict'

const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {foreignKey: 'creator_id'})
      Todo.belongsTo(models.User, {foreignKey: 'responsible_id'})
    }
  }

  const fields = {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    due_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    priority: {
      allowNull: false,
      type: DataTypes.ENUM('high', 'middle', 'low'),
      defaultValue: 'middle'
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('todo', 'doing', 'done', 'cancel'),
      defaultValue: 'todo'
    },
    creator_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {model: 'User', key: 'id'}
    },
    responsible_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {model: 'User', key: 'id'}
    }
  }

  Todo.init(fields, {
    sequelize,
    modelName: 'Todo',
    freezeTableName: true,
    tableName: 'todos'
  })

  return Todo
}
