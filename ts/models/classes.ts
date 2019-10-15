import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'classes';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    channel: {
      type: DataTypes.ENUM('audio','video'),
      allowNull: false,
      defaultValue: 'audio'
    },
    original_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    abstract: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    author_abstract: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_pic: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    virtual_unlocks: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    unlocks: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    desc: {
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