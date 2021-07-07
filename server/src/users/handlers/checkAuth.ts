import * as express from 'express';
import HttpStatus from 'http-status-codes';
import * as typeorm from 'typeorm';

import * as schemas from '../../schemas';
import * as utils from '../../utils';

export const checkAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const LOG_PREFIX = 'users.handlers.checkAuth:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const token = req.headers.authorization;

      const sessionsRepository = typeormConnection.getRepository(schemas.session);

      const session = await sessionsRepository.findOne({
        where: { token },
        relations: ['user']
      });

      if (!session) {
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
      }

      req.session = session;

      return next();
    },
    LOG_PREFIX,
    res
  );
};
