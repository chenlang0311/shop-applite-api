"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const logger = require("winston");
const config_1 = require("../config/config");
class SeqzDao {
    static getInstance() {
        if (!SeqzDao.instance)
            SeqzDao.instance = new Sequelize(config_1.config.mysql.database, config_1.config.mysql.username, config_1.config.mysql.password, config_1.config.mysql.options);
        return SeqzDao.instance;
    }
}
exports.SeqzDao = SeqzDao;
class DaoBase {
    constructor(seqz, modelName) {
        try {
            if (!seqz)
                throw new Error("invalid sequelize");
            this.seqz = seqz;
            this.modelName = modelName;
        }
        catch (e) {
            logger.error(e);
        }
    }
    model(modelName) {
        try {
            let name = this.modelName;
            if (modelName) {
                if (this.seqz.isDefined(modelName)) {
                    name = modelName;
                }
                else {
                    throw new Error(`invalid modelName: ${modelName}`);
                }
            }
            return this.seqz.model(name);
        }
        catch (e) {
            logger.error(e);
            return undefined;
        }
    }
}
exports.DaoBase = DaoBase;

//# sourceMappingURL=../maps/dao/base.js.map
