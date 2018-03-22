'use strict'

export default (sequelize, DataTypes) => {
  const Path = sequelize.define('Path', {
    pathId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    value: DataTypes.JSON
  })

  Path.associate = (models) => {
    Path.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'userId'
    })
  }

  return Path
}
