module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
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
    subscribable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'Takip edilebilir id\'si integer olmalıdır.'
        }
      }
    },
    subscribable_type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
      validate: {
        isIn: {
          args: [['user', 'community']],
          msg: 'Takip edilebilir tipi geçersiz.'
        }
      }
    }
  }, {
    underscored: true
  })

  Subscription.associate = models => {
    Subscription.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'follower'
    })
    Subscription.belongsTo(models.Community, {
      foreignKey: 'subscribable_id',
      constraints: false,
      targetKey: 'id',
      as: 'community'
    })
    Subscription.belongsTo(models.User, {
      foreignKey: 'subscribable_id',
      constraints: false,
      targetKey: 'id',
      as: 'user'
    })
  }

  return Subscription
}
