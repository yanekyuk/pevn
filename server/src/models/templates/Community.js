module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('Community', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [5, 250],
          msg: 'Topluluk başlığı 5 ila 250 karakter arasında olmalıdır.'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: 'Topluluk slug\'ı yanlızca küçük harf ve tirelerden oluşabilir.'
        }
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /#?[0-9A-Fa-f]{6}/,
          msg: 'Topluluk rengi hex formatında olmalıdır.'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          min: 20,
          msg: 'Topluluk açıklaması en az 20 karakter uzunluğunda olmalıdır.'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true
  })

  Community.associate = models => {
    Community.belongsToMany(models.User, {
      through: 'Moderator',
      as: 'moderators',
      foreignKey: 'community_id'
    })
    Community.hasMany(models.Post, {
      foreignKey: 'community_id',
      sourceKey: 'id',
      as: 'posts'
    })
    Community.hasOne(models.CommunitySetting, {
      foreignKey: 'community_id',
      sourceKey: 'id',
      as: 'settings'
    })
    Community.hasMany(models.Subscription, {
      foreignKey: 'subscribable_id',
      constraints: false,
      as: 'subscriptions',
      scope: {
        subscribable_type: 'community'
      }
    })
  }

  return Community
}
