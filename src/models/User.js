'use strict'

import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    redirect: DataTypes.JSON,
    status: DataTypes.STRING
  })

  User.prototype.authenticate = function(password) {
    return bcrypt.compareSync(password, this.password)
  }

  User.prototype.permissions = function() {
    let allowedPaths = []
    let excludedPaths = []

    for (const index in this.Permissions) {
      const permission = this.Permissions[index]

      if (permission.UserPermission.allowedPath) {
        allowedPaths.push(permission.path)
      }
      else {
        excludedPaths.push(permission.path)
      }
    }

    return { allowedPaths, excludedPaths }
  }

  User.associate = (models) => {
    User.belongsToMany(models.Permission, {
      through: 'UserPermission',
      as: 'Permissions',
      foreignKey: 'userId'
    })

    User.hasMany(models.Session, {
      as: 'Sessions',
      foreignKey: 'userId'
    })
  }

  return User
}
