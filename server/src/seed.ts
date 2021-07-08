/**
 * The spec did not indicate how services or promocodes would be created, so the database needs to be seeded.
 *
 * NOTES
 * 1. All Service names are UPPERCASE and  STRING types
 * 2. All promo codes are UPPERCASE and  STRING types
 * 3. Discount values are generated randomly with Math.random()
 *
 */

import * as typeorm from 'typeorm';
import * as schemas from './schemas';
import { loadServices } from './initialize';

const PROMO_CODES = [
  'HALLOWEEN',
  'FIT_BOY_SUMMER',
  'CHOOSEBETTER',
  'GLUTTON',
  'A-TRUE-STEAL',
  'MAKE-IT-RAIN',
  'YOUTUBE-20',
  'FATHERS-DAY-007'
];

const SERVICES: { name: string; description: string }[] = [
  { name: 'KFC', description: "Finger-Lickin' Good" },
  { name: 'WALMART', description: 'Save Money. Live Better.' },
  {
    name: 'AMAZON',
    description: 'Low prices you can trust'
  },
  {
    name: 'APPLE',
    description: 'Simple, yet efficient'
  },
  {
    name: 'BESTBUY',
    description: "You'll never get it cheaper elsewhere"
  },
  {
    name: "PAPA JOHN's",
    description: 'The best pizza in the world'
  },
  {
    name: 'NIKE',
    description: 'Just do it'
  },
  {
    name: 'PUMA',
    description: "I'm supposed to be NIKE"
  },
  {
    name: 'ADIDAS',
    description: "Three stripes don't make you Naruto"
  }
];

const seed = async () => {
  await loadServices();
  const typeormConnection = typeorm.getConnection();

  const runInTrasaction = async (transactionalEntityManager: typeorm.EntityManager) => {
    const servicesRepository = transactionalEntityManager.getRepository(schemas.service);
    const promoCodesRepsitory = transactionalEntityManager.getRepository(schemas.promoCode);

    const services = await servicesRepository.save(SERVICES);

    console.log('Services saved');

    const promoCodeEntities: Partial<schemas.PromoCodeEntity>[] = [];

    for (const code of PROMO_CODES) {
      for (const service of services) {
        promoCodeEntities.push({
          code,
          discountValue: Math.random().toFixed(2),
          status: 'active',
          service
        });
      }
    }

    await promoCodesRepsitory.save(promoCodeEntities);
  };

  await typeormConnection.manager.transaction(runInTrasaction);
};

seed().then(() => console.log('Database seeded'));
