module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [10, 250],
          msg: 'Başlık 10 ile 250 karakter uzunluğunda olmalıdır.'
        }
      }
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: 'Topluluk ID\'si integer olmalıdır'
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['post', 'link', 'image']],
          msg: 'Gönderi tipi geçersiz.'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    validate: {
      hasUrlIfLink () {
        if (this.type === 'link' && !this.body.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
          throw new Error('Geçersiz link.')
        } else if (!this.type === 'link' && this.body.length < 10) {
          throw new Error('İleti en az 10 karakter uzunluğunda olmalıdır.')
        }
      }
    }
  })

  Post.associate = models => {
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'user'
    })
    Post.belongsTo(models.Community, {
      foreignKey: 'community_id',
      targetKey: 'id',
      as: 'community'
    })
    Post.belongsToMany(models.Tag, {
      through: 'PostTag',
      as: 'tags',
      foreignKey: 'post_id'
    })
    Post.hasMany(models.Comment, {
      foreignKey: 'commentable_id',
      constraints: false,
      as: 'comments',
      scope: {
        commentable_type: 'post'
      }
    })
    Post.hasMany(models.Like, {
      foreignKey: 'likeable_id',
      constraints: false,
      as: 'likes',
      scope: {
        likeable_type: 'post'
      }
    })
    Post.hasMany(models.Save, {
      foreignKey: 'saveable_id',
      constraints: false,
      as: 'saves',
      scope: {
        saveable_type: 'post'
      }
    })
  }

  return Post
}
