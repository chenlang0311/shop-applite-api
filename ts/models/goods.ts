import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'goods';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stock:{
      type: DataTypes.CHAR(64)
    },
    pic: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state: {
      type: DataTypes.ENUM('normal','deleted'),
      allowNull: false,
      defaultValue: 'normal'
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