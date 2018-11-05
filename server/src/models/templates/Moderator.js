module.exports = (sequelize, DataTypes) => {
  const Moderator = sequelize.define('Moderator', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'moderatorIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Kullanıcı ID\'si integer olmalıdır'
        }
      }
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'moderatorIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Topluluk ID\'si integer olmalıdır'
        }
      }
    }
  }, {
    underscored: true
  })

  return Moderator
}
