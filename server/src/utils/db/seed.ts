/**
 * The spec did not indicate how services or promocodes would be created, so the database needs to be seeded.
 *
 * NOTES
 * 1. All Service names are UPPERCASE and  STRING types
 * 2. All promo codes are UPPERCASE and  STRING types
 * 3. Discount values are generated randomly with Math.random()
 *
 */
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as schemas from '../../schemas';
import { loadServicesAndConfig } from '../../initialize';

const SERVICES: { name: string; description: string; promoCodes: string[] }[] = [
  {
    name: 'KFC',
    description: "Finger-Lickin' Good",
    promoCodes: ['HALLOWEEN', 'FANTASTIC-FOUR', 'HI-SPEEDY', 'MAKE-IT-RAIN', 'BEN-10', 'UNCLES-007']
  },
  {
    name: 'WALMART',
    description: 'Save Money. Live Better.',
    promoCodes: ['SUMMER-JOE', 'BLACK-N-BLUE', 'ONCE-IN-A-LIFETIME', 'MERKEL-GMBH-20', 'YOUTUBE-20', 'GI-JOE-007']
  },
  {
    name: 'AMAZON',
    description: 'Low prices you can trust',
    promoCodes: ['FLYING-GOD', 'NARUTO-25', 'MIRACLES-40', 'MERKEL-GMBH-10', 'YOUTUBE-20', 'MS-BUILD']
  },
  {
    name: 'APPLE',
    description: 'Simple, yet efficient',
    promoCodes: ['SAIKA-FESTIVAL', 'NEW_MOON-15', 'A-TRUE-STEAL', 'PLAYSTION-PLUS', 'SPOTIFY-PLUS', 'GOLDEN-DAWN']
  },
  {
    name: 'BESTBUY',
    description: "You'll never get it cheaper elsewhere",
    promoCodes: ['INDEPENDCE-20', 'LABOUR-DAY', 'QUEENS-VICTORIAL', 'WORLD-CUP-2019', 'APEX-20', 'FATHERS-DAY-007']
  },
  {
    name: "PAPA JOHN's",
    description: 'The best pizza in the world',
    promoCodes: ['SUPERNOVA', 'FIT_BOY_SUMMER', 'CHRISTMAS-20', 'I-CANT-STOP', 'FORNITE-LEGENDS', 'JAMES-BOND-O2']
  },
  {
    name: 'NIKE',
    description: 'Just do it',
    promoCodes: ['BOQUET', 'THEE-STALLION', 'HAPPY-WEDNESDAY', 'MAKE-IT-STOP', 'BATTLE-ROYALE', 'RECKON-MI6']
  },
  {
    name: 'PUMA',
    description: "I'm supposed to be NIKE",
    promoCodes: ['KING-SIZE', 'YOUTUBE-10', 'VALENTINE-SPECIAL']
  },
  {
    name: 'ADIDAS',
    description: "Three stripes don't make you Naruto",
    promoCodes: ['ONE-PUNCH-MAN', 'ZEUS-30', 'INCURSIO', 'AKAME-GA-KILL']
  },
  {
    name: "DOMINO's PIZZA",
    description: "Bloated pizza, it's cheap though",
    promoCodes: ['CHOOSEBETTER', 'GLUTTON', 'A-TRUE-STEAL', 'UFC-289']
  },
  {
    name: 'GUCCI',
    description: 'Expensive garbage, but hey luxury!',
    promoCodes: ['HALLOWEEN', 'FIT_BOY_SUMMER']
  },
  {
    name: 'PRADA',
    description: 'Just look good, nothing more!',
    promoCodes: ['YOUTUBE-20', 'FATHERS-DAY-007']
  }
];

export const seed = async (existingConnection?: typeorm.Connection) => {
  let typeormConnection: typeorm.Connection;

  if (existingConnection) {
    typeormConnection = existingConnection;
  } else {
    await loadServicesAndConfig();
    typeormConnection = typeorm.getConnection();
  }

  const runInTrasaction = async (transactionalEntityManager: typeorm.EntityManager) => {
    const servicesRepository = transactionalEntityManager.getRepository(schemas.service);
    const promoCodesRepository = transactionalEntityManager.getRepository(schemas.promoCode);
    const promoActivationsRepository = transactionalEntityManager.getRepository(schemas.promoActivation);

    // delete everything in services, promoCodes and promoActivations table before re-populating it
    const deletionCriteria = { id: typeorm.Not(typeorm.IsNull()) };
    await promoActivationsRepository.delete(deletionCriteria);
    await promoCodesRepository.delete(deletionCriteria);
    await servicesRepository.delete(deletionCriteria);

    console.log('Cleaned existing records');

    const services = await servicesRepository.save(SERVICES.map(({ name, description }) => ({ name, description })));

    console.log('Services saved');

    const servicesMap = _.keyBy(SERVICES, 'name');
    const promoCodeEntities: Partial<schemas.PromoCodeEntity>[] = [];

    for (const service of services) {
      const promoCode = servicesMap[service.name].promoCodes;
      for (const code of promoCode)
        promoCodeEntities.push({
          code,
          discountValue: Math.random().toFixed(2),
          status: 'active',
          service
        });
    }

    await promoCodesRepository.save(promoCodeEntities);
    console.log('Promo codes saved!');
  };

  await typeormConnection.manager.transaction(runInTrasaction);
};
