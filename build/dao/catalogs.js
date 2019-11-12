"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require("sequelize");
const base_1 = require("./base");
class Dao extends base_1.DaoBase {
    constructor(seqz, modelName) {
        super(seqz, modelName);
    }
    static getInstance(seqz = base_1.SeqzDao.getInstance()) {
        if (!Dao.instance)
            Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async findClassIdByFileid(fileid) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res.get() : undefined;
    }
    async updateReadsCount(id, num = 1) {
        let res = await this.model().update({ reads: sequelize.literal('`reads` + ' + num) }, { where: { id: id } });
        return res ? res : undefined;
    }
    async findCatalogTotal() {
        let res = await this.model().count({ where: { state: 'normal' } });
        return (res || res === 0) ? res : undefined;
    }
}
Dao.tableName = 'catalogs';
exports.CatalogsDao = Dao;

//# sourceMappingURL=../maps/dao/catalogs.js.map
