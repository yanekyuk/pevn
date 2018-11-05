module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    paranoid: true,
    underscored: true
  })

  Message.associate = models => {
    Message.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
    Message.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      targetKey: 'id',
      as: 'chat'
    })
    Message.belongsTo(models.Chat, {
      constraints: false,
      foreignKey: 'id',
      targetKey: 'last_message',
      as: 'lastMessage'
    })
  }

  return Message
}
