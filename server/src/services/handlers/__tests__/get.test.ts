import request from 'supertest';
import HttpStatus from 'http-status-codes';
import express from 'express';
import http from 'http';
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as initialize from '../../../initialize';
import * as utils from '../../../utils';
import * as schemas from '../../../schemas';

describe('services.handlers.get', () => {
  const app: express.Application = express();
  let server: http.Server;
  let agent: request.SuperAgentTest;
  let typeormConnection: typeorm.Connection;
  let servicesRepository: typeorm.Repository<schemas.ServiceEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);
    servicesRepository = typeormConnection.getRepository(schemas.service);

    initialize.loadRoutersAndUtilities(app);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);
    await utils.db.seed(typeormConnection);

    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterEach(async () => {
    server && server.close();
  });

  afterAll(async () => {
    await typeormConnection.close();
  });

  it('It should return 401, if user is not logged in', async () => {
    const response = await agent.get(`/services/get?name=dancer`);
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Should return all the services in the database', async () => {
    const services = await servicesRepository.find();
    expect(services.length).toBeGreaterThan(1);
  });

  it('An authenticated user should be able to get the services in the database', async () => {
    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);

    const authorizationToken = signupResponse.body.session.token;
    const getServicesResponse = await agent.get('/services/get?name=nike').set({ authorization: authorizationToken });

    expect(getServicesResponse.status).toBe(HttpStatus.OK);
    expect(getServicesResponse.body).toBeDefined();
  });

  it('should return all the services the database if no search criteria is sent from request', async () => {
    const noOfServicesInDatabase = await servicesRepository.count();

    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);

    const authorizationToken = signupResponse.body.session.token;
    const getServicesResponse = await agent.get('/services/get').set({ authorization: authorizationToken });
    expect(getServicesResponse.status).toBe(HttpStatus.OK);

    expect(getServicesResponse.body.length).toBe(noOfServicesInDatabase);
  });
});
