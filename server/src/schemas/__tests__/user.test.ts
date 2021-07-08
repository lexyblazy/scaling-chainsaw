import * as typeorm from 'typeorm';
import * as utils from '../../utils';
import { UserEntity } from '../types';
import { user as userEntity } from '../user';

describe('schemas.user:', () => {
  let typeormConnection: typeorm.Connection;
  let usersRepository: typeorm.Repository<UserEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    usersRepository = typeormConnection.getRepository(userEntity);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('Read/Write from/to the database', async () => {
    const savedUser = await usersRepository.save(utils.tests.fakes.user);
    expect(savedUser).toBeDefined();

    const foundUser = await usersRepository.findOne({ id: savedUser.id });
    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual(savedUser);
  });

  it('Update/Delete from database', async () => {
    const user = await usersRepository.save(utils.tests.fakes.user);
    expect(user).toBeDefined();

    // update
    const newEmail = 'bakugo@gmail.com';
    user.email = newEmail;
    const updatedUser = await usersRepository.save(user);
    expect(updatedUser.email).toBe(newEmail);

    // delete
    await usersRepository.delete({ id: user.id });

    const foundUser = await usersRepository.findOne({ id: user.id });
    expect(foundUser).not.toBeDefined();
  });
});
