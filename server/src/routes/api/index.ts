import { Router } from 'express';
import { serverStatusRouter } from './server-status.js';

const router = Router();

router.use('/server-status', serverStatusRouter);

export default router;