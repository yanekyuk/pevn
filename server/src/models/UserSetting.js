module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define('UserSetting', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: {
          args: true,
          msg: 'Kullanıcı id\'si integer olmalıdır.'
        }
      }
    },
    dark: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]], // 0 is false, 1 is true, 2 is auto
          msg: 'Dark boolean olmalıdır.'
        }
      }
    },
    nsfw: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Nsfw boolean olmalıdır.'
        }
      }
    },
    spoiler: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Spoiler boolean olmalıdır.'
        }
      }
    },
    anonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Anon boolean olmalıdır.'
        }
      }
    },
    colorization: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Renklendirme boolean olmalıdır.'
        }
      }
    }
  }, {
    underscored: true
  })

  UserSetting.associate = models => {
    UserSetting.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
  }

  return UserSetting
}
