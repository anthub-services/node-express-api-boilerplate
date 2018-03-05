'use strict'

export default (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    sessionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    userAgent: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    token: DataTypes.TEXT,
    signedOut: DataTypes.BOOLEAN
  })

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'userId'
    })
  }

  return Session
}
