module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 250],
          msg: 'Topluluk başlığı 5 ila 250 karakter arasında olmalıdır.'
        }
      }
    },
    last_message: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          args: true,
          msg: 'Son mesaj id\'si integer olmalıdır.'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true
  })

  Chat.associate = models => {
    Chat.belongsToMany(models.User, {
      through: 'UserChat',
      as: 'users',
      foreignKey: 'chat_id'
    })
    Chat.hasMany(models.Message, {
      foreignKey: 'chat_id',
      sourceKey: 'id',
      as: 'messages'
    })
    Chat.hasOne(models.Message, {
      foreignKey: 'id',
      sourceKey: 'last_message',
      as: 'lastMessage',
      constraints: false
    })
  }

  return Chat
}
