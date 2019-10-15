import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'users';

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

    public async findByUnionId(unionId: string) {
        let res = await this.model().findOne({ where: { unionId: unionId } });
        return res ? res.get() : undefined;
    }

    public async createUser(opts: any) {
        let res = await this.model().create(opts);
        return res ? res.get() : undefined;
    }

    public async updateUserInfo(user_id: string | number, opts: any) {
        let res = await this.model().update(opts, { where: { id: user_id } });
        return res ? res : undefined;
    }
}

export { Dao as UsersDao }