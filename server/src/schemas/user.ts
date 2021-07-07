import * as typeorm from 'typeorm';
import { UserEntity } from './types';

export const user = new typeorm.EntitySchema<UserEntity>({
  name: 'users',

  columns: {
    id: {
      type: 'uuid',
      generated: 'uuid',
      primary: true,
      nullable: false
    },

    createdAt: {
      type: 'timestamp',
      createDate: true
    },

    updatedAt: {
      type: 'timestamp',
      updateDate: true
    },

    email: {
      type: String,
      nullable: false
    },

    normalizedEmail: {
      type: String,
      unique: true,
      nullable: false
    },

    password: {
      type: String,
      nullable: false
    }
  }
});
