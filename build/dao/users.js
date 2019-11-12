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
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async findByUnionId(unionId) {
        let res = await this.model().findOne({ where: { unionId: unionId } });
        return res ? res.get() : undefined;
    }
    async createUser(opts) {
        let res = await this.model().create(opts);
        return res ? res.get() : undefined;
    }
    async updateUserInfo(user_id, opts) {
        let res = await this.model().update(opts, { where: { id: user_id } });
        return res ? res : undefined;
    }
}
Dao.tableName = 'users';
exports.UsersDao = Dao;

//# sourceMappingURL=../maps/dao/users.js.map
