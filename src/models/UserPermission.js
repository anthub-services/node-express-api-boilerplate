'use strict'

export default (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    userPermissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    allowedPath: DataTypes.BOOLEAN
  })

  return UserPermission
}
