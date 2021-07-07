import * as typeorm from 'typeorm';

const ormconfig: typeorm.ConnectionOptions = {
  type: 'postgres',

  host: 'localhost',
  port: 5432,

  username: '',
  password: '',
  database: 'the_room_services',

  schema: 'public',

  synchronize: false,
  logging: false,

  entities: ['lib/schemas/**/*.js'],

  migrations: ['lib/migration/**/*.js'],

  cli: { migrationsDir: 'src/migration' }
};

export default ormconfig;
