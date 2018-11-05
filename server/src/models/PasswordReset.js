module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define('PasswordReset', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'passwordResetIndex'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'passwordResetIndex'
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    underscored: true,
    hooks: {
      beforeValidate: PasswordReset => {
        PasswordReset.expires = Date.now() + 3600000
      }
    }
  })

  PasswordReset.associate = models => {
    PasswordReset.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
  }

  return PasswordReset
}
