'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate (models) {
      Order.belongsToMany(models.Product, {
        through: {
          model: models.OrderItem,
          unique: false
        },
        foreignKey: 'orderId',
        as: 'orderProducts'
      })
      Order.belongsTo(models.User)
      Order.hasMany(models.Payment)
    }
  }
  Order.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      sn: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      shippingStatus: DataTypes.STRING,
      paymentStatus: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Order',
      underscored: true
    }
  )
  return Order
}
