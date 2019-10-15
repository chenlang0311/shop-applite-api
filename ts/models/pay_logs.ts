import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'pay_logs';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pay_type: {
      type: DataTypes.ENUM('wxpay','alipay'),
      allowNull: false,
      defaultValue: 'wxpay'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
      freezeTableName: true,
      timestamps: false,
      tableName: tableName
    });
};