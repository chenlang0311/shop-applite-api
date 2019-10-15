"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableName = 'swipers';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(tableName, {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        category: {
            type: DataTypes.ENUM('home'),
            allowNull: false,
            defaultValue: 'home'
        },
        parent_id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true
        },
        channel: {
            type: DataTypes.ENUM('classes'),
            allowNull: true,
            defaultValue: 'classes'
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pic: {
            type: DataTypes.TEXT,
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
        level: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        state: {
            type: DataTypes.ENUM('normal', 'deleted'),
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

//# sourceMappingURL=../maps/models/swipers.js.map
