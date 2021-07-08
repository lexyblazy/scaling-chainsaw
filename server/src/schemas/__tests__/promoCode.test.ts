import * as typeorm from 'typeorm';
import * as utils from '../../utils';
import { ServiceEntity, PromoCodeEntity, PromoStatus } from '../types';
import { service as serviceEntity } from '../service';
import { promoCode as promoCodeEntity } from '../promoCode';

describe('schemas.promoCode:', () => {
  let typeormConnection: typeorm.Connection;
  let promoCodeRepository: typeorm.Repository<PromoCodeEntity>;
  let serviceRepository: typeorm.Repository<ServiceEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    promoCodeRepository = typeormConnection.getRepository(promoCodeEntity);
    serviceRepository = typeormConnection.getRepository(serviceEntity);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('Read/Write from/to the database', async () => {
    const service = await serviceRepository.save(utils.tests.fakes.service);
    expect(service).toBeDefined();

    const savedPromoCode = await promoCodeRepository.save({
      ...utils.tests.fakes.promoCode,
      service
    });

    expect(savedPromoCode).toBeDefined();

    const foundPromoCode = await promoCodeRepository.findOne({ where: { id: savedPromoCode.id }, relations: ['service'] });
    expect(foundPromoCode).toBeDefined();
    expect(foundPromoCode).toEqual(savedPromoCode);
  });

  it('Update/Delete from database', async () => {
    const service = await serviceRepository.save(utils.tests.fakes.service);
    expect(service).toBeDefined();

    const promoCode = await promoCodeRepository.save({
      ...utils.tests.fakes.promoCode,
      service
    });

    expect(promoCode).toBeDefined();

    // update
    const newStatus: PromoStatus = 'canceled';
    promoCode.status = newStatus;
    const updatedPromoCode = await promoCodeRepository.save(promoCode);
    expect(updatedPromoCode.status).toBe(newStatus);

    // delete
    await promoCodeRepository.delete({ id: promoCode.id });
    const foundPromoCode = await promoCodeRepository.findOne({ id: promoCode.id });
    expect(foundPromoCode).not.toBeDefined();
  });
});
