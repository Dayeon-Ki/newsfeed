'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.User, { foreignKey: "followeeId", as: "followee" });
      this.belongsTo(models.User, { foreignKey: "followerId", as: "follower" });


    }
  }
  Follow.init({
    followeeId: DataTypes.STRING,
    followerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};