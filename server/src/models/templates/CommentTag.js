module.exports = (sequelize, DataTypes) => {
  const CommentTag = sequelize.define('CommentTag', {
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'commentTagIndex',
      validate: {
        isInt: {
          args: true,
          msg: 'İçerik ID\'si integer olmalıdır'
        }
      }
    },
    tag_slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'commentTagIndex'
    }
  }, {
    underscored: true
  })

  return CommentTag
}
