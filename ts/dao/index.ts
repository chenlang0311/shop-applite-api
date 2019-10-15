import * as logger from 'winston';
import { SeqzDao } from './base';
import { UsersDao } from './users';
import { CatalogsDao } from './catalogs';
import { CategoriesDao } from './categories';
import { ClassesDao } from './classes';
import { DetailsDao } from './details';
import { PayLogsDao } from './pay_logs';
import { RecordsDao } from './records';
import { SwipersDao } from './swipers';
import { OrdersDao } from './orders';
import { GoodsDao } from './goods';

function initInstance() {
    const seqz = SeqzDao.getInstance();

    /** init instance */
    UsersDao.getInstance(seqz);
    CatalogsDao.getInstance(seqz);
    CategoriesDao.getInstance(seqz);
    ClassesDao.getInstance(seqz);
    GoodsDao.getInstance(seqz);
    DetailsDao.getInstance(seqz);
    PayLogsDao.getInstance(seqz);
    RecordsDao.getInstance(seqz);
    SwipersDao.getInstance(seqz);
    OrdersDao.getInstance(seqz);
    /** end */

    logger.info('init instance OK.');
}

function initDao() {
    const seqz = SeqzDao.getInstance();

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

export {
    initDao,
    UsersDao,
    CatalogsDao,
    CategoriesDao,
    ClassesDao,
    DetailsDao,
    PayLogsDao,
    RecordsDao,
    SwipersDao,
    OrdersDao,
    GoodsDao
}