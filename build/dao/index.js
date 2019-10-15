"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const base_1 = require("./base");
const users_1 = require("./users");
exports.UsersDao = users_1.UsersDao;
const catalogs_1 = require("./catalogs");
exports.CatalogsDao = catalogs_1.CatalogsDao;
const categories_1 = require("./categories");
exports.CategoriesDao = categories_1.CategoriesDao;
const classes_1 = require("./classes");
exports.ClassesDao = classes_1.ClassesDao;
const details_1 = require("./details");
exports.DetailsDao = details_1.DetailsDao;
const pay_logs_1 = require("./pay_logs");
exports.PayLogsDao = pay_logs_1.PayLogsDao;
const records_1 = require("./records");
exports.RecordsDao = records_1.RecordsDao;
const swipers_1 = require("./swipers");
exports.SwipersDao = swipers_1.SwipersDao;
const orders_1 = require("./orders");
exports.OrdersDao = orders_1.OrdersDao;
const goods_1 = require("./goods");
exports.GoodsDao = goods_1.GoodsDao;
function initInstance() {
    const seqz = base_1.SeqzDao.getInstance();
    /** init instance */
    users_1.UsersDao.getInstance(seqz);
    catalogs_1.CatalogsDao.getInstance(seqz);
    categories_1.CategoriesDao.getInstance(seqz);
    classes_1.ClassesDao.getInstance(seqz);
    goods_1.GoodsDao.getInstance(seqz);
    details_1.DetailsDao.getInstance(seqz);
    pay_logs_1.PayLogsDao.getInstance(seqz);
    records_1.RecordsDao.getInstance(seqz);
    swipers_1.SwipersDao.getInstance(seqz);
    orders_1.OrdersDao.getInstance(seqz);
    /** end */
    logger.info('init instance OK.');
}
function initDao() {
    const seqz = base_1.SeqzDao.getInstance();
    /** init sequelize */
    seqz.import('../models/users');
    let Catalogs = seqz.import('../models/catalogs');
    seqz.import('../models/categories');
    let Classes = seqz.import('../models/classes');
    let Details = seqz.import('../models/details');
    seqz.import('../models/pay_logs');
    let Records = seqz.import('../models/records');
    seqz.import('../models/swipers');
    seqz.import('../models/orders');
    seqz.import('../models/goods');
    Classes.hasMany(Catalogs, { foreignKey: 'class_id', as: 'catalogs' });
    Classes.hasOne(Details, { foreignKey: 'class_id', as: 'details' });
    Records.belongsTo(Classes, { foreignKey: 'class_id', as: 'classes' });
    // Catalogs.belongsTo(Classes, );
    // Details.belongsTo(Classes, { foreignKey: 'class_id', as: 'details' });
    /** end */
    logger.info('init sequelize OK.');
    return initInstance;
}
exports.initDao = initDao;

//# sourceMappingURL=../maps/dao/index.js.map
