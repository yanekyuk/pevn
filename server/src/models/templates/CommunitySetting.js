module.exports = (sequelize, DataTypes) => {
  const CommunitySetting = sequelize.define('CommunitySetting', {
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: {
          args: true,
          msg: 'Topluluk id\'si integer olmalıdır.'
        }
      }
    },
    allow_link: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Link izni boolean olmalıdır.'
        }
      }
    },
    allow_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'İçerik izni boolean olmalıdır.'
        }
      }
    },
    allow_image: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    underscored: true
  })

  CommunitySetting.associate = models => {
    CommunitySetting.belongsTo(models.Community, {
      foreignKey: 'community_id',
      targetKey: 'id',
      as: 'community'
    })
  }

  return CommunitySetting
}
