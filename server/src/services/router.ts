import * as express from 'express';
import * as handlers from './handlers';
import * as users from '../users';

export const create = () => {
  const router = express.Router();

  router.get('/get', users.handlers.checkAuth, handlers.get);

  router.get('/list', users.handlers.checkAuth, handlers.list);

  router.post('/activate-promo', users.handlers.checkAuth, handlers.activatePromo);

  return router;
};
