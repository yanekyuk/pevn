module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          min: 4,
          msg: 'Yorumunuz en az 4 karakter uzunluğunda olmalıdır.'
        }
      }
    },
    commentable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: 'Yorumlanabilir id\'si integer olmalıdır.'
        }
      }
    },
    commentable_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['post', 'comment']],
          msg: 'Yorumlanabilir tipi geçersiz.'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true
  })

  Comment.associate = models => {
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
    Comment.belongsTo(models.Post, {
      foreignKey: 'commentable_id',
      constraints: false,
      targetKey: 'id',
      as: 'post'
    })
    Comment.belongsToMany(models.Tag, {
      through: 'CommentTag',
      as: 'tags',
      foreignKey: 'comment_id'
    })
    Comment.belongsTo(models.Comment, {
      foreignKey: 'commentable_id',
      constraints: false,
      targetKey: 'id',
      as: 'commentee'
    })
    Comment.hasMany(models.Comment, {
      foreignKey: 'commentable_id',
      constraints: false,
      targetKey: 'id',
      scope: {
        commentable_type: 'comment'
      },
      as: 'comments'
    })
    Comment.hasMany(models.Like, {
      foreignKey: 'likeable_id',
      constraints: false,
      as: 'likes',
      scope: {
        likeable_type: 'comment'
      }
    })
    Comment.hasMany(models.Save, {
      foreignKey: 'saveable_id',
      constraints: false,
      as: 'saves',
      scope: {
        saveable_type: 'comment'
      }
    })
  }

  return Comment
}
