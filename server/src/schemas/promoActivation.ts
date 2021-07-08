import * as typeorm from 'typeorm';
import { PromoActivationEntity } from './types';
import * as consts from '../consts';

export const promoActivation = new typeorm.EntitySchema<PromoActivationEntity>({
  name: 'promoActivations',

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

    status: {
      type: 'enum',
      enum: consts.PROMO_STATUSES,
      nullable: false
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'users',
      nullable: false,
      joinColumn: true
    },

    service: {
      type: 'many-to-one',
      target: 'services',
      nullable: false,
      joinColumn: true
    },

    promoCode: {
      type: 'many-to-one',
      target: 'promoCodes',
      nullable: false,
      joinColumn: true
    }
  },
  indices: [
    {
      name: 'indexUqActivePromotionForUserAndService', // Ensures that a user cannot have more than one active promotion for a service
      columns: ['user', 'service', 'promoCode'],
      where: `"status"='active'`,
      unique: true,
      synchronize: false
    }
  ]
});
