import * as typeorm from 'typeorm';
import { ServiceEntity } from './types';

export const service = new typeorm.EntitySchema<ServiceEntity>({
  name: 'services',

  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
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

    name: {
      type: String,
      nullable: false
    },

    description: {
      type: String,
      nullable: false
    }
  }
});
