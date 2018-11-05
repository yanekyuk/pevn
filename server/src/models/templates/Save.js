module.exports = (sequelize, DataTypes) => {
  const Save = sequelize.define('Save', {
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
    saveable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Kaydedilebilir id\'si integer olmalıdır.'
        }
      }
    },
    saveable_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isIn: {
          args: [['post', 'comment']],
          msg: 'Kaydedilebilir tipi geçersiz.'
        }
      }
    }
  }, {
    underscored: true
  })

  Save.associate = models => {
    Save.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
    Save.belongsTo(models.Post, {
      foreignKey: 'saveable_id',
      constraints: false,
      targetKey: 'id',
      as: 'post'
    })
    Save.belongsTo(models.Comment, {
      foreignKey: 'saveable_id',
      constraints: false,
      targetKey: 'id',
      as: 'comment'
    })
  }

  return Save
}
