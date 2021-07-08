export type PromoStatus = 'active' | 'pending' | 'canceled' | 'expired';

export interface UserEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  email: string;
  normalizedEmail: string;
  password: string;
}

export interface SessionEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  token: string;

  user: UserEntity;
}

export interface ServiceEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  name: string;

  description: string;
}

export interface PromoCodeEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  code: string;
  status: PromoStatus;

  discountValue: string;

  service: ServiceEntity;
}

export interface PromoActivationEntity {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  service: ServiceEntity;
  user: UserEntity;
  promoCode: PromoCodeEntity;

  status: PromoStatus;
}
