import * as typeorm from 'typeorm';
import { seed } from '../seed';
import * as tests from '../../tests';
import * as schemas from '../../../schemas';

describe('utils.db.seed', () => {
  let typeormConnection: typeorm.Connection;
  let servicesRepository: typeorm.Repository<schemas.ServiceEntity>;
  let promoCodesRepository: typeorm.Repository<schemas.PromoCodeEntity>;

  beforeAll(async () => {
    typeormConnection = await tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);
    servicesRepository = typeormConnection.getRepository(schemas.service);
    promoCodesRepository = typeormConnection.getRepository(schemas.promoCode);
  });

  it('should populate the Services and PromoCodes tables', async () => {
    await seed(typeormConnection);

    const [servicesCount, promoCodesCount] = await Promise.all([servicesRepository.count(), promoCodesRepository.count()]);

    expect(servicesCount).toBeGreaterThan(1);
    expect(promoCodesCount).toBeGreaterThan(1);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });
});
