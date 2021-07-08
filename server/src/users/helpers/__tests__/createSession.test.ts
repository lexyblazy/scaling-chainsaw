import * as typeorm from 'typeorm';
import { createSession } from '../createSession';
import * as schemas from '../../../schemas';
import * as utils from '../../../utils';

describe('users.helpers.createSession:', () => {
  let typeormConnection: typeorm.Connection;
  let usersRepository: typeorm.Repository<schemas.UserEntity>;
  let user: schemas.UserEntity;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    usersRepository = typeormConnection.getRepository(schemas.user);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
    user = await usersRepository.save(utils.tests.fakes.user);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('should return an object containing only token field', async () => {
    const session = await createSession(user);
    expect(session).toBeTruthy();
    expect(session?.token).toBeDefined();
  });
});
