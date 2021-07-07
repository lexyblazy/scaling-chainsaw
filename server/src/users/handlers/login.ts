import bcrypt from 'bcrypt';
import * as express from 'express';
import * as typeorm from 'typeorm';
import HttpStatus from 'http-status-codes';

import * as schemas from '../../schemas';
import * as helpers from '../helpers';
import * as utils from '../../utils';
import _ from 'lodash';

export const login = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'users.handlers.login:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const usersRepository = typeormConnection.getRepository(schemas.user);

      const { email, password } = req.body;

      if (!email || !password) {
        const missingField = !email ? 'email' : 'password';
        return res.status(HttpStatus.BAD_REQUEST).send({ error: `${missingField} is required` });
      }

      const isValidEmail = utils.email.isValidEmail(email);

      if (!isValidEmail) {
        return res.status(HttpStatus.BAD_REQUEST).send({ error: `Email is invalid` });
      }

      const normalizedEmail = utils.email.normalize(email);

      const user = await usersRepository.findOne({
        where: {
          normalizedEmail
        }
      });

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ error: `Incorrect email or password` });
      }

      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (!isCorrectPassword) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ error: `Incorrect email or password` });
      }

      const session = await helpers.createSession(user);

      return res.status(HttpStatus.OK).send({ user: _.pick(user, 'email'), session });
    },
    LOG_PREFIX,
    res
  );
};
