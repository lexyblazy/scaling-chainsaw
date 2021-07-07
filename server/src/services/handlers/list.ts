import * as express from 'express';
import * as typeorm from 'typeorm';
import * as utils from '../../utils';
import * as schemas from '../../schemas';

export const list = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'services.handlers.list:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const servicesRepository = typeormConnection.getRepository(schemas.service);

      const page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);

      const MAX_RECORDS_PER_PAGE = 10;
      const skip = (page - 1) * MAX_RECORDS_PER_PAGE;

      const services = await servicesRepository.find({ where: {}, take: MAX_RECORDS_PER_PAGE, skip: skip < 0 ? 0 : skip });

      return res.send(services);
    },
    LOG_PREFIX,
    res
  );
};
