import express from 'express';
import cas from '../util/cas.js';
import * as controller from '../controllers/funds.js';

const router = express.Router();

router.get('/funds', cas.bounce, controller.getViewFunds);
router.post('/delete-fund/:fundId', cas.bounce, controller.deleteFundHandler);

export default router;
