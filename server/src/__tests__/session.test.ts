import * as typeorm from 'typeorm';
import * as uuid from 'uuid';
import * as utils from '../utils';
import { SessionEntity, UserEntity } from '../schemas/types';
import { user as userEntity } from '../schemas/user';
import { session as sessionEntity } from '../schemas/session';

describe('schemas.session:', () => {
  let typeormConnection: typeorm.Connection;
  let usersRepository: typeorm.Repository<UserEntity>;
  let sessionsRepository: typeorm.Repository<SessionEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    usersRepository = typeormConnection.getRepository(userEntity);
    sessionsRepository = typeormConnection.getRepository(sessionEntity);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('Read/Write from/to the database', async () => {
    const user = await usersRepository.save(utils.tests.fakes.user);
    expect(user).toBeDefined();

    const savedSession = await sessionsRepository.save({
      token: uuid.v4(),
      user
    });

    expect(savedSession).toBeDefined();

    const foundSession = await sessionsRepository.findOne({ where: { id: savedSession.id }, relations: ['user'] });
    expect(foundSession).toBeDefined();
    expect(foundSession).toEqual(savedSession);
  });

  it('Update/Delete from database', async () => {
    const user = await usersRepository.save(utils.tests.fakes.user);
    expect(user).toBeDefined();

    const savedSession = await sessionsRepository.save({
      token: uuid.v4(),
      user
    });
    expect(savedSession).toBeDefined();

    // update
    const newToken = uuid.v4();
    savedSession.token = newToken;
    const updatedSession = await sessionsRepository.save(savedSession);
    expect(updatedSession.token).toBe(newToken);

    // delete
    await sessionsRepository.delete({ id: savedSession.id });

    const foundSession = await sessionsRepository.findOne({ id: savedSession.id });
    expect(foundSession).not.toBeDefined();
  });
});
