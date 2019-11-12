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
    async createOrders(opts) {
        let res = await this.model().create(opts);
        return res ? res.get() : undefined;
    }
    async paySucess(out_trade_no, transaction_id, total_fee) {
        let self = this;
        let res = await self.seqz.transaction(async (t) => {
            // 订单获取时，需要锁表等待更新
            let order = await this.model().findOne({ where: { out_trade_no: out_trade_no }, transaction: t, lock: t.LOCK.UPDATE });
            if (!order)
                return undefined;
            let order_t = order.get();
            if (Number(order_t.amount) != Number(total_fee))
                return undefined;
            if (order_t.pay_status !== 'success') {
                await self.model('records').create({
                    user_id: order_t.user_id,
                    class_id: order_t.class_id,
                    amount: total_fee,
                    desc: '支付成功'
                }, { transaction: t });
                await self.model().update({ transaction_id: transaction_id, pay_status: 'success' }, { where: { id: order_t.id }, transaction: t });
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
Dao.tableName = 'orders';
exports.OrdersDao = Dao;

//# sourceMappingURL=../maps/dao/orders.js.map
