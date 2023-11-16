"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsToMany(models.Product, {
        through: {
          model: models.CartItem,
          unique: false,
        },
        foreignKey: "CartId",
        as: "cartProducts",
      });
    }
  }
  Cart.init(
    {
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
      underscored: true,
    }
  );
  return Cart;
};
