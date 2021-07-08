import * as typeorm from 'typeorm';

export const createTypeormConnection = async () => {
  const typeormConnectionOptions = await typeorm.getConnectionOptions();

  Object.assign(typeormConnectionOptions, {
    database: 'tests_database'
  });

  return await typeorm.createConnection(typeormConnectionOptions);
};
