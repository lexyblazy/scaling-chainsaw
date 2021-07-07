import * as typeorm from 'typeorm';
import { PromoCodeEntity } from './types';
import * as consts from '../consts';

export const promoCode = new typeorm.EntitySchema<PromoCodeEntity>({
  name: 'promoCodes',

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

    code: {
      type: String,
      nullable: false
    },

    status: {
      type: 'enum',
      enum: consts.PROMO_STATUSES,
      nullable: false
    },

    discountValue: {
      type: 'numeric',
      nullable: false,
      precision: 8,
      scale: 2
    }
  },
  relations: {
    service: {
      type: 'many-to-one',
      target: 'services',
      nullable: false,
      joinColumn: true
    }
  }
});
