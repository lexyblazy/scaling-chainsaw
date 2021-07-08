import { UserEntity, PromoCodeEntity, ServiceEntity } from '../../schemas/types';

export const user: Partial<UserEntity> = {
  email: 'tokido@mail.com',
  password: 'some_random_password',
  normalizedEmail: 'tokido@mail.com'
};

export const service: Partial<ServiceEntity> = {
  description: 'The best burger in the world, Big Mac',
  name: 'Mac Donaldo'
};
export const promoCode: Partial<PromoCodeEntity> = {
  status: 'active',
  discountValue: ' 0.5',
  code: 'EAT_ONCE_LIVE_FOREVER'
};
