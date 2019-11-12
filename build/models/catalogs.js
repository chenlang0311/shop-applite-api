"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableName = 'catalogs';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(tableName, {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        fileid: {
            type: DataTypes.CHAR(32),
            allowNull: true
        },
        class_id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        audition: {
            type: DataTypes.ENUM('yes', 'no'),
            allowNull: false,
            defaultValue: 'no'
        },
        video_link: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        definition: {
            type: DataTypes.CHAR(32),
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        size: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cover_pic: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        virtual_reads: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        reads: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        level: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        state: {
            type: DataTypes.ENUM('pending', 'normal', 'deleted'),
            allowNull: false,
            defaultValue: 'pending'
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

//# sourceMappingURL=../maps/models/catalogs.js.map
