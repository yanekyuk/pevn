module.exports = (sequelize, DataTypes) => {
  const UserChat = sequelize.define('UserChat', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'userChatIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Kullanıcı ID\'si integer olmalıdır'
        }
      }
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'userChatIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Mesajlaşma ID\'si integer olmalıdır'
        }
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    underscored: true
  })

  return UserChat
}
