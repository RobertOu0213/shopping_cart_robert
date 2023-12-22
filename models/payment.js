'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate (models) {
      Payment.belongsTo(models.Order)
    }
  };
  Payment.init(
    {
      orderId: DataTypes.INTEGER,
      payment_method: DataTypes.STRING,
      isSuccess: DataTypes.BOOLEAN,
      paidAt: DataTypes.DATE,
      message: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Payment'
    }
  )
  return Payment
}
