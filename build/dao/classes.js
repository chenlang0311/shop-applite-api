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
    async updateUnlocksCount(order_id, num = 1) {
        let res = await this.model().update({ unlocks: sequelize.literal('`unlocks` + ' + num) }, { where: { id: order_id } });
        return res ? res : undefined;
    }
    async findClassList(opts) {
        let count = await this.model().count(opts);
        let catalogs = 'catalogs';
        let model_catalogs = this.model(catalogs);
        opts.include = [
            { model: model_catalogs, as: catalogs, attributes: ['duration'], where: { state: 'normal' }, required: false }
        ];
        let res = await this.model().findAll(opts);
        return res ? { count: count, rows: res } : undefined;
    }
    async findClassDetails(id) {
        let [catalogs, details] = ['catalogs', 'details'];
        let [model_catalogs, model_details] = [this.model(catalogs), this.model(details)];
        let options = { where: { id: id } };
        let attr = ['id', 'title', 'audition', 'video_link', 'duration', 'cover_pic', 'virtual_reads', 'reads', 'desc', 'level'];
        options.include = [
            { model: model_catalogs, as: catalogs, attributes: attr, where: { state: 'normal' }, required: false },
            { model: model_details, as: details, attributes: ['detail_pic', 'content', 'desc'], required: false }
        ];
        options.order = [[{ model: model_catalogs, as: catalogs }, 'level', 'asc']];
        let res = await this.model().findOne(options);
        return res ? res.get() : undefined;
    }
    async findClassTotal() {
        let res = await this.model().count({ where: { state: 'normal' } });
        return (res || res === 0) ? res : undefined;
    }
}
Dao.tableName = 'classes';
exports.ClassesDao = Dao;

//# sourceMappingURL=../maps/dao/classes.js.map
