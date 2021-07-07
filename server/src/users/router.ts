import * as express from 'express';
import * as handlers from './handlers';

export const create = () => {
  const router = express.Router();

  router.post('/signup', handlers.signup);

  router.post('/login', handlers.login);

  router.post('/logout', handlers.checkAuth, handlers.logout);

  return router;
};
