import * as Sequelize from 'sequelize';
import * as logger from 'winston';
import { config } from '../config/config';

export class SeqzDao {
    private static instance: Sequelize.Sequelize;

    public static getInstance() {
        if (!SeqzDao.instance) SeqzDao.instance = new Sequelize(
            config.mysql.database, config.mysql.username, config.mysql.password, config.mysql.options);
        return SeqzDao.instance;
    }
}

export class DaoBase {
    protected seqz: Sequelize.Sequelize;
    protected modelName: string;

    protected constructor(seqz: Sequelize.Sequelize, modelName: string) {
        try {
            if (!seqz) throw new Error("invalid sequelize");
            this.seqz = seqz;
            this.modelName = modelName;
        } catch (e) {
            logger.error(e);
        }
    }

    protected model(modelName?: string) {
        try {
            let name = this.modelName;
            if (modelName) {
                if (this.seqz.isDefined(modelName)) {
                    name = modelName;
                } else {
                    throw new Error(`invalid modelName: ${modelName}`);
                }
            }
            return this.seqz.model<Sequelize.Instance<any>, any>(name);
        } catch (e) {
            logger.error(e);
            return undefined;
        }
    }
}