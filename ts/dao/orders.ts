import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'orders';

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

    public async createOrders(opts: any) {
        let res = await this.model().create(opts);
        return res ? res.get() : undefined;
    }

    public async paySucess(out_trade_no: string, transaction_id: string, total_fee: string | number) {
        let self = this;
        let res = await self.seqz.transaction(async t => {
            // 订单获取时，需要锁表等待更新
            let order = await this.model().findOne({ where: { out_trade_no: out_trade_no }, transaction: t, lock: t.LOCK.UPDATE });
            if (!order) return undefined;
            let order_t = order.get();
            if (Number(order_t.amount) != Number(total_fee)) return undefined;

            if (order_t.pay_status !== 'success') {
                await self.model('records').create({
                    user_id: order_t.user_id,
                    class_id: order_t.class_id,
                    amount: total_fee,
                    desc: '支付成功'
                }, { transaction: t });
                await self.model().update(
                    { transaction_id: transaction_id, pay_status: 'success' },
                    { where: { id: order_t.id }, transaction: t }
                )

                return {
                    doLogs: true, data: {
                        order_id: order_t.id, user_id: order_t.user_id, class_id: order_t.class_id, amount: total_fee, desc: '支付成功'
                    }
                };
            }

            return { doLogs: false, data: null };
        });

        return res ? res : undefined;
    }
}

export { Dao as OrdersDao }