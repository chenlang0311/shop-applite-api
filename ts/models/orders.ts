import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'orders';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    out_trade_no: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    transaction_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    nonce_str: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    prepay_id: {
      type: DataTypes.STRING(64),
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
    pay_status: {
      type: DataTypes.ENUM('create','success','fail','cancel'),
      allowNull: false,
      defaultValue: 'create'
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