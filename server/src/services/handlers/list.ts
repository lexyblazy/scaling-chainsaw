import * as express from 'express';
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as utils from '../../utils';
import * as schemas from '../../schemas';

export const list = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'services.handlers.list:';

  return utils.logging.logHandlerException(
    async () => {
      const typeormConnection = typeorm.getConnection();
      const servicesRepository = typeormConnection.getRepository(schemas.service);
      const promoCodesRepository = typeormConnection.getRepository(schemas.promoCode);

      const page = Number.isNaN(Number(req.query.page)) ? 1 : Number(req.query.page);

      const MAX_RECORDS_PER_PAGE = 10;
      const skip = (page - 1) * MAX_RECORDS_PER_PAGE;

      const services = await servicesRepository.find({ where: {}, take: MAX_RECORDS_PER_PAGE, skip: skip < 0 ? 0 : skip });
      const servicesIds = services.map((service) => service.id);

      const promoCodes = await promoCodesRepository
        .createQueryBuilder('promo')
        .leftJoinAndSelect('promo.service', 'service')
        .where(`"promo"."serviceId" IN (:...ids)`, {
          ids: servicesIds
        })
        .andWhere(`promo.status = :status`, { status: 'active' })
        .getMany();

      const promoCodesServiceIdMap: { [key in string]: string[] } = {};

      for (const promoCode of promoCodes) {
        const serviceId = promoCode.service.id;
        if (promoCodesServiceIdMap[serviceId]) {
          promoCodesServiceIdMap[serviceId].push(promoCode.code);
        } else {
          promoCodesServiceIdMap[serviceId] = [promoCode.code];
        }
      }

      const servicesWithPromoCodes = services.map((service) => ({
        ...service,
        promoCodes: promoCodesServiceIdMap[service.id]
      }));

      return res.send({ services: servicesWithPromoCodes });
    },
    LOG_PREFIX,
    res
  );
};
