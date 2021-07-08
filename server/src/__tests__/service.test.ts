import * as typeorm from 'typeorm';
import * as utils from '../utils';
import { ServiceEntity } from '../schemas/types';
import { service as serviceEntity } from '../schemas/service';

describe('schemas.service:', () => {
  let typeormConnection: typeorm.Connection;
  let servicesRepository: typeorm.Repository<ServiceEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    servicesRepository = typeormConnection.getRepository(serviceEntity);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('Read/Write from/to the database', async () => {
    const savedService = await servicesRepository.save(utils.tests.fakes.service);
    expect(savedService).toBeDefined();

    const foundService = await servicesRepository.findOne({ id: savedService.id });
    expect(foundService).toBeDefined();
    expect(foundService).toEqual(savedService);
  });

  it('Update/Delete from database', async () => {
    const service = await servicesRepository.save(utils.tests.fakes.service);
    expect(service).toBeDefined();

    // update
    const newDescription = 'Always good, You bet!';
    service.description = newDescription;
    const updatedService = await servicesRepository.save(service);
    expect(updatedService.description).toBe(newDescription);

    // delete
    await servicesRepository.delete({ id: service.id });

    const foundService = await servicesRepository.findOne({ id: service.id });
    expect(foundService).not.toBeDefined();
  });
});
