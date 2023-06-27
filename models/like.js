'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }
  Like.init({
    userId: DataTypes.STRING,
    postId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};