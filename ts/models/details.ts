import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'details';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      unique: true
    },
    detail_pic: {
      type: DataTypes.TEXT,
      allowNull: true
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