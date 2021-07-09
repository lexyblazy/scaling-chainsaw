import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as typeorm from 'typeorm';
import * as consts from './consts';
import * as users from './users';
import * as services from './services';
import ormconfig from './ormconfig';

export const loadRouters = (app: express.Application) => {
  app.use('/users', users.router.create());
  app.use('/services', services.router.create());
};

export const loadServices = async () => {
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

export const loadUtilities = (app: express.Application) => {
  app.use(cors({ origin: [consts.FRONTEND_DEV_URL] }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};

export const loadRoutersAndUtilities = (app: express.Application) => {
  loadUtilities(app);
  loadRouters(app);
};

export const loadConfig = () => {
  dotenv.config();
};

export const loadAll = async (app: express.Application) => {
  loadConfig();
  loadUtilities(app);
  loadRouters(app);
  await loadServices();
};

export const loadServicesAndConfig = async () => {
  loadConfig();
  await loadServices();
};
