import { Router } from 'express';
import { serverStatusRouter } from './server-status';

const router = Router();

router.use('/server-status', serverStatusRouter);

export default router;