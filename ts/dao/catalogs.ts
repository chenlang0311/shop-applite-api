import { Sequelize } from 'sequelize';
import * as sequelize from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'catalogs';

    public constructor(seqz: Sequelize, modelName: string) {
        super(seqz, modelName);
    }

    public static getInstance(seqz: Sequelize = SeqzDao.getInstance()) {
        if (!Dao.instance) Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }

    public async findByPrimary(id: string | number) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }

    public async findClassIdByFileid(fileid: string | number) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res.get() : undefined;
    }

    public async updateReadsCount(id: string | number, num: string | number = 1) {
        let res = await this.model().update({ reads: sequelize.literal('`reads` + ' + num) }, { where: { id: id } });
        return res ? res : undefined;
    }

    public async findCatalogTotal() {
        let res = await this.model().count({ where: { state: 'normal' } });
        return (res || res === 0) ? res : undefined;
    }
}

export { Dao as CatalogsDao }