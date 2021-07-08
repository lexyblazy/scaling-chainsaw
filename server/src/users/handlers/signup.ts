import bcrypt from 'bcrypt';
import * as express from 'express';
import * as typeorm from 'typeorm';
import HttpStatus from 'http-status-codes';

import * as schemas from '../../schemas';
import * as helpers from '../helpers';
import * as utils from '../../utils';
import _ from 'lodash';

export const signup = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'users.handlers.signup:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const usersRepository = typeormConnection.getRepository(schemas.user);
      const SALT_ROUNDS = 10;

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

      const existingUser = await usersRepository.findOne({
        where: {
          normalizedEmail
        }
      });

      if (existingUser) {
        return res.status(HttpStatus.BAD_REQUEST).send({ error: `Email is already in use` });
      }

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

      const newUser: Partial<schemas.UserEntity> = {
        email,
        password: hashedPassword,
        normalizedEmail
      };

      const user = await usersRepository.save(newUser);
      const session = await helpers.createSession(user);

      return res.status(HttpStatus.OK).send({ user: _.pick(user, 'email'), session });
    },
    LOG_PREFIX,
    res
  );
};
