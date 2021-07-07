import * as express from 'express';
import * as typeorm from 'typeorm';
import * as schemas from '../../schemas';
import * as utils from '../../utils';

export const get = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'services.handlers.get:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const servicesRepository = typeormConnection.getRepository(schemas.service);
      const serviceName = req.params.service_name;

      const services = await servicesRepository.find({
        where: {
          name: typeorm.Like(`%${serviceName.toUpperCase()}%`)
        }
      });

      return res.send(services);
    },
    LOG_PREFIX,
    res
  );
};
