const Slug = require('slug')

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Toplulukta aynı etiketten zaten var.'
      },
      validate: {
        len: {
          args: [2, 20],
          msg: 'Etiket 2 ile 20 karakter uzunluğunda olmalıdır.'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
      validate: {
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: 'Topluluk slug\'ı yanlızca küçük harf ve tirelerden oluşabilir.'
        }
      }
    },
    is_link: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    hooks: {
      beforeValidate: Tag => {
        Tag.slug = Slug(Tag.title, {lower: true})
      }
    }
  })

  Tag.associate = models => {
    Tag.belongsToMany(models.Post, {
      through: 'PostTag',
      as: 'posts',
      foreignKey: 'tag_slug'
    })
    Tag.belongsToMany(models.Comment, {
      through: 'CommentTag',
      as: 'comments',
      foreignKey: 'tag_slug'
    })
  }

  return Tag
}
