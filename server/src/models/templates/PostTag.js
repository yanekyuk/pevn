module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'postTagIndex',
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
      unique: 'postTagIndex'
    }
  }, {
    underscored: true
  })

  return PostTag
}
