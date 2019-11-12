"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    async findByUserId(opts) {
        let classes = 'classes';
        let model_classes = this.model(classes);
        opts.include = [{ model: model_classes, as: classes }];
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async findByUnique(user_id, class_id) {
        let res = await this.model().findOne({ where: { user_id: user_id, class_id: class_id } });
        return res ? res.get() : undefined;
    }
    async findAcountClassByUserId(user_id) {
        let classes = 'classes';
        let model_classes = this.model(classes);
        let opts = { where: { user_id: user_id } };
        opts.include = [{ model: model_classes, as: classes, required: true }];
        let res = await this.model().count(opts);
        return (res || res === 0) ? res : undefined;
    }
    async findAcountCatalogByUserId(user_id) {
        let [classes, catalogs] = ['classes', 'catalogs'];
        let [model_classes, model_catalogs] = [this.model(classes), this.model(catalogs)];
        let opts = { where: { user_id: user_id } };
        opts.include = [{
                model: model_classes,
                as: classes,
                required: true,
                include: [{ model: model_catalogs, as: catalogs, where: { audition: 'no', state: 'normal' }, required: true }]
            }];
        let res = await this.model().count(opts);
        return (res || res === 0) ? res : undefined;
    }
}
Dao.tableName = 'records';
exports.RecordsDao = Dao;

//# sourceMappingURL=../maps/dao/records.js.map
