import { UserEntity } from '../../schemas/types';

export const user: Partial<UserEntity> = {
  email: 'tokido@mail.com',
  password: 'some_random_password',
  normalizedEmail: 'tokido@mail.com'
};
