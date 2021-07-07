import * as uuid from 'uuid';
import * as typeorm from 'typeorm';
import _ from 'lodash';

import { SessionEntity, UserEntity } from '../../schemas/types';
import * as schemas from '../../schemas';
import * as utils from '../../utils';

export const createSession = async (user: UserEntity) => {
  const LOG_NAME = 'users.helpers.createSession:  ';

  return utils.logging.logFunctionException(async () => {
    const typeormConnection = typeorm.getConnection();
    const sessionsRepository = typeormConnection.getRepository(schemas.session);

    const newSession: Partial<SessionEntity> = {
      token: uuid.v4(),
      user
    };

    const session = await sessionsRepository.save(newSession);

    return _.pick(session, 'token');
  }, LOG_NAME);
};
