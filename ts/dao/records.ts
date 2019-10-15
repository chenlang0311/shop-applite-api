import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'records';

    public constructor(seqz: Sequelize, modelName: string) {
        super(seqz, modelName);
    }

    public static getInstance(seqz: Sequelize = SeqzDao.getInstance()) {
        if (!Dao.instance) Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }

    public async findByUserId(opts: any) {
        let classes = 'classes';
        let model_classes = this.model(classes);
        opts.include = [{ model: model_classes, as: classes }];

        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }

    public async findByPrimary(id: string | number) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }

    public async findByUnique(user_id: string | number, class_id: string | number) {
        let res = await this.model().findOne({ where: { user_id: user_id, class_id: class_id } });
        return res ? res.get() : undefined;
    }

    public async findAcountClassByUserId(user_id: string | number) {
        let classes = 'classes';
        let model_classes = this.model(classes);
        let opts: any = { where: { user_id: user_id } };
        opts.include = [{ model: model_classes, as: classes, required: true }];
        let res = await this.model().count(opts);
        return (res || res === 0) ? res : undefined;
    }

    public async findAcountCatalogByUserId(user_id: string | number) {
        let [classes, catalogs] = ['classes', 'catalogs'];
        let [model_classes, model_catalogs] = [this.model(classes), this.model(catalogs)];
        let opts: any = { where: { user_id: user_id } };
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

export { Dao as RecordsDao }