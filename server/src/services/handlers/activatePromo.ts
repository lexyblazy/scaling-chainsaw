import * as typeorm from 'typeorm';
import * as express from 'express';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import * as schemas from '../../schemas';
import * as utils from '../../utils';

export const activatePromo = async (req: express.Request, res: express.Response) => {
  const LOG_PREFIX = 'services.handlers.activatePromo:';

  return utils.logging.logHandlerException(
    async () => {
      const { code } = req.body;

      if (!code) {
        res.status(HttpStatus.BAD_REQUEST).send({ error: 'Promo code is missing' });

        return;
      }

      const typeormConnection = typeorm.getConnection();
      const promoCodesRepsitory = typeormConnection.getRepository(schemas.promoCode);
      const promoActivationsRepsitory = typeormConnection.getRepository(schemas.promoActivation);

      const promoCode = await promoCodesRepsitory.findOne({
        where: {
          code: String(code).toUpperCase()
        },
        relations: ['service']
      });

      if (!promoCode) {
        res.status(HttpStatus.BAD_REQUEST).send({ error: 'Promo Code does not exist' });

        return;
      }

      if (promoCode.status !== 'active') {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ error: 'This promotion is not active' });

        return;
      }

      const { user } = req.session;

      const existingActivePromoActivation = await promoActivationsRepsitory.findOne({
        where: {
          status: 'active',
          user,
          service: promoCode.service,
          promoCode: promoCode
        }
      });

      if (existingActivePromoActivation) {
        res.status(HttpStatus.FORBIDDEN).send({ error: 'You already have an existing active promo for this code' });

        return;
      }

      const newPromoActivation: Partial<schemas.PromoActivationEntity> = {
        user,
        service: promoCode.service,
        promoCode,
        status: 'active'
      };

      const promoActivation = await promoActivationsRepsitory.save(newPromoActivation);

      const response = {
        id: promoActivation.id,
        serviceName: promoActivation.service.name,
        discountValue: promoActivation.promoCode.discountValue,
        promoCodeStatus: promoActivation.promoCode.status,
        activationStatus: promoActivation.status
      };

      res.send(response);
    },
    LOG_PREFIX,
    res
  );
};
