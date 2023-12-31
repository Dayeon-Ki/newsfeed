"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Post, { foreignKey: "userId", as: "posts" });
      this.hasMany(models.Comment, { foreignKey: "userId", as: "comments" });


      this.hasMany(models.Like, { foreignKey: 'userId', as: "likes" });
      this.hasMany(models.Follow, { foreignKey: 'followeeId', as: "followees" });
      this.hasMany(models.Follow, { foreignKey: "followerId", as: "followers" });


      // define association here
    }
  }
  User.init(
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      img: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      introduction: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      emailConfirm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // 기본값은 미인증 상태
      },
      randomNumber: {
        type: DataTypes.STRING,
      },
      snsId: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
