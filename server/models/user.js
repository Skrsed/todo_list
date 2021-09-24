'use strict'

const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(User, { foreignKey: 'lead_id' })
      User.hasMany(models.Todo, { foreignKey: 'creator_id' })
      User.hasMany(models.Todo, { foreignKey: 'responsible_id' })
    }
  }

  const fields = {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    patronymic: {
      allowNull: false,
      type: DataTypes.STRING
    },
    login: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password_hash: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lead_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }

  User.init(fields, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    tableName: 'users'
  })
  
  return User
}