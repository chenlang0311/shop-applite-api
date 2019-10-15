import { Application } from 'express';
import usersRouterV1 from './v1/users';
import classesRouterV1 from './v1/classes';
import catalogsRouterV1 from './v1/catalogs';
// import vodsRouterV1 from './v1/vods';
import paysRouterV1 from './v1/pays';
import swipersRouterV1 from './v1/swipers';
import goodssRouterV1 from './v1/goods';

export function routers(app: Application) {
	app.use('/api/v1/users', usersRouterV1);
	app.use('/api/v1/classes', classesRouterV1);
	app.use('/api/v1/catalogs', catalogsRouterV1);
	// app.use('/api/v1/vod', vodsRouterV1);
	app.use('/api/v1/pays', paysRouterV1);
	app.use('/api/v1/swipers', swipersRouterV1);
	app.use('/api/v1/goods', goodssRouterV1);
	
}