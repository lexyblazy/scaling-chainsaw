import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as utils from '../../utils';
import { ServiceEntity, PromoCodeEntity, PromoStatus, PromoActivationEntity, UserEntity } from '../types';
import { service as serviceEntity } from '../service';
import { promoActivation as promoActivationEntity } from '../promoActivation';
import { promoCode as promoCodeEntity } from '../promoCode';
import { user as userEntity } from '../user';

describe('schemas.promoActivation:', () => {
  let typeormConnection: typeorm.Connection;
  let promoActivationsRepsitory: typeorm.Repository<PromoActivationEntity>;
  let promoCodesRepository: typeorm.Repository<PromoCodeEntity>;
  let servicesRepository: typeorm.Repository<ServiceEntity>;
  let usersRepository: typeorm.Repository<UserEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    promoActivationsRepsitory = typeormConnection.getRepository(promoActivationEntity);
    promoCodesRepository = typeormConnection.getRepository(promoCodeEntity);
    servicesRepository = typeormConnection.getRepository(serviceEntity);
    usersRepository = typeormConnection.getRepository(userEntity);
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
    const service = await servicesRepository.save(utils.tests.fakes.service);
    expect(service).toBeDefined();
    const promoCode = await promoCodesRepository.save({
      ...utils.tests.fakes.promoCode,
      service
    });
    expect(promoCode).toBeDefined();

    const newPromoActivation = await promoActivationsRepsitory.save({
      promoCode,
      service,
      user,
      status: 'active'
    });

    const foundPromoActivation = await promoActivationsRepsitory.findOne({
      where: { id: newPromoActivation.id },
      relations: ['service', 'user', 'promoCode']
    });
    expect(foundPromoActivation).toBeDefined();
    expect(foundPromoActivation?.service).toEqual(service);
    expect(foundPromoActivation?.user).toEqual(user);
    expect(foundPromoActivation?.promoCode).toEqual(_.omit(promoCode, 'service'));
  });

  it('Update/Delete from database', async () => {
    const user = await usersRepository.save(utils.tests.fakes.user);
    expect(user).toBeDefined();

    const service = await servicesRepository.save(utils.tests.fakes.service);
    expect(service).toBeDefined();

    const promoCode = await promoCodesRepository.save({
      ...utils.tests.fakes.promoCode,
      service
    });
    expect(promoCode).toBeDefined();

    const newPromoActivation: PromoActivationEntity = await promoActivationsRepsitory.save({
      promoCode,
      service,
      user,
      status: 'active'
    });

    // update
    const newStatus: PromoStatus = 'canceled';
    newPromoActivation.status = newStatus;
    const updatedPromoActivation = await promoActivationsRepsitory.save(newPromoActivation);
    expect(updatedPromoActivation.status).toBe(newStatus);

    // delete
    await promoActivationsRepsitory.delete({ id: newPromoActivation.id });
    const foundPromoActivation = await promoActivationsRepsitory.findOne({ id: newPromoActivation.id });
    expect(foundPromoActivation).not.toBeDefined();
  });
});
