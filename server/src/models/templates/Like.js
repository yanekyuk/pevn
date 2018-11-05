module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Kullanıcı id\'si integer olmalıdır.'
        }
      }
    },
    likeable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Beğenilebilir id\'si integer olmalıdır.'
        }
      }
    },
    likeable_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isIn: {
          args: [['post', 'comment']],
          msg: 'Yorumlanabilir tipi geçersiz.'
        }
      }
    }
  }, {
    underscored: true
  })

  Like.associate = models => {
    Like.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
    Like.belongsTo(models.Post, {
      foreignKey: 'likeable_id',
      constraints: false,
      targetKey: 'id',
      as: 'post'
    })
    Like.belongsTo(models.Comment, {
      foreignKey: 'likeable_id',
      constraints: false,
      targetKey: 'id',
      as: 'comment'
    })
  }

  return Like
}
