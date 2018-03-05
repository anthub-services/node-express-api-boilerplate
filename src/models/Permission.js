'use strict'

export default (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    path: {
      type: DataTypes.STRING,
      unique: true
    }
  })

  Permission.associate = (models) => {
    Permission.belongsToMany(models.User, {
      as: 'Users',
      through: 'UserPermission',
      foreignKey: 'permissionId'
    })
  }

  return Permission
}
