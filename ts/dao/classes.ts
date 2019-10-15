import { Sequelize } from 'sequelize';
import * as sequelize from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'classes';

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

    public async updateUnlocksCount(order_id: string | number, num: any = 1) {
        let res = await this.model().update({ unlocks: sequelize.literal('`unlocks` + ' + num) }, { where: { id: order_id } });
        return res ? res : undefined;
    }

    public async findClassList(opts: any) {
        let count = await this.model().count(opts);
        let catalogs = 'catalogs';
        let model_catalogs = this.model(catalogs);
        opts.include = [
            { model: model_catalogs, as: catalogs, attributes: ['duration'], where: { state: 'normal' }, required: false }
        ];

        let res = await this.model().findAll(opts);
        return res ? { count: count, rows: res } : undefined;
    }

    public async findClassDetails(id: string | number) {
        let [catalogs, details] = ['catalogs', 'details'];
        let [model_catalogs, model_details] = [this.model(catalogs), this.model(details)];

        let options: any = { where: { id: id } };
        let attr = ['id', 'title', 'audition', 'video_link', 'duration', 'cover_pic', 'virtual_reads', 'reads', 'desc', 'level'];
        options.include = [
            { model: model_catalogs, as: catalogs, attributes: attr, where: { state: 'normal' }, required: false },
            { model: model_details, as: details, attributes: ['detail_pic', 'content', 'desc'], required: false }
        ];
        options.order = [[{ model: model_catalogs, as: catalogs }, 'level', 'asc']];
        let res = await this.model().findOne(options);

        return res ? res.get() : undefined;
    }

    public async findClassTotal() {
        let res = await this.model().count({ where: { state: 'normal' } });
        return (res || res === 0) ? res : undefined;
    }
}

export { Dao as ClassesDao }