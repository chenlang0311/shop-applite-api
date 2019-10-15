import { Sequelize, DataTypes } from 'sequelize';

const tableName = 'users';

module.exports = function (sequelize: Sequelize, DataTypes: DataTypes) {
  return sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.CHAR(64),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    unionid: {
      type: DataTypes.CHAR(32),
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.CHAR(32),
      allowNull: true,
      unique: true
    },
    mini_openid: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    app_openid: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    web_openid: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sign_date:{
      type:DataTypes.DATE
    },
    coin:{
      type:DataTypes.INTEGER
    },
    avatarurl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    abstract: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    catalog_ids: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state: {
      type: DataTypes.ENUM('normal','deleted'),
      allowNull: false,
      defaultValue: 'normal'
    },
    readtime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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