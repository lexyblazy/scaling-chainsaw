import dotenv from 'dotenv';
import express from 'express';
import * as typeorm from 'typeorm';
import * as users from './users';
import * as services from './services';
import ormconfig from './ormconfig';

export const loadRouters = (app: express.Application) => {
  app.use('/users', users.router.create());
  app.use('/services', services.router.create());
};

export const loadServices = async () => {
  dotenv.config();
  const typeormConnectionOptions = ormconfig;

  Object.assign(typeormConnectionOptions, {
    host: process.env.SQL_HOST,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    extra: { max: 4 }
  });

  await typeorm.createConnection(typeormConnectionOptions);
  console.log('Connected to database...');
};
