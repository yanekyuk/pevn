const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const Slug = require('slug')

function hashPassword (User, options) {
  const SALT_FACTOR = 8

  if (!User.changed('password')) {
    return
  }

  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(User.password, salt, null))
    .then(hash => {
      User.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Bu e-posta adresine kayıtlı bir kullanıcı zaten var.'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Geçersiz e-posta adresi girildi.'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[0-9a-zıöüçşğ]+(?: ?[0-9a-zıöüçşğ]){3,55}$/,
          msg: 'Geçersiz kullanıcı adı girildi. Yalnızca küçük harfler, numaralar ve boşluk kullanılabilir. 4 ile 55 arası karakter uzunluğuna sahip olabilir.'
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
          msg: 'Kullanıcı slug\'ı yanlızca küçük harf ve tirelerden oluşabilir.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 60],
          msg: 'Geçersiz parola girildi. Parola, 8-32 karakter uzunluğunda olmalıdır.'
        }
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
      validate: {
        isInt: {
          args: true,
          msg: 'Geçersiz rol.'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    hooks: {
      beforeValidate: User => {
        User.slug = Slug(User.username, {lower: true})
      },
      beforeSave: hashPassword
    }
  })

  User.associate = models => {
    // User.hasMany(models.Comment, {
    //   foreignKey: 'user_id',
    //   sourceKey: 'id',
    //   as: 'comments'
    // })
    // User.hasMany(models.Post, {
    //   foreignKey: 'user_id',
    //   sourceKey: 'id',
    //   as: 'posts'
    // })
    // User.hasMany(models.Like, {
    //   foreignKey: 'user_id',
    //   sourceKey: 'id',
    //   as: 'likes'
    // })
    User.hasOne(models.UserSetting, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'settings'
    })
    User.hasOne(models.PasswordReset, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      as: 'passwordReset'
    })
    // User.hasMany(models.Subscription, {
    //   foreignKey: 'user_id',
    //   sourceKey: 'id',
    //   as: 'subscriptions'
    // })
    // User.hasMany(models.Subscription, {
    //   foreignKey: 'subscribable_id',
    //   constraints: false,
    //   as: 'followers',
    //   scope: {
    //     subscribable_type: 'user'
    //   }
    // })
    // User.belongsToMany(models.Chat, {
    //   through: 'UserChat',
    //   as: 'chats',
    //   foreignKey: 'user_id'
    // })
    // User.belongsToMany(models.Community, {
    //   through: 'Moderator',
    //   as: 'communities',
    //   foreignKey: 'user_id'
    // })
  }

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareAsync(password, this.password)
  }

  return User
}
