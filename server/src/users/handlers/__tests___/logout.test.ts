import request from 'supertest';
import HttpStatus from 'http-status-codes';
import express from 'express';
import http from 'http';
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as initialize from '../../../initialize';
import * as utils from '../../../utils';

describe('user.handlers.logout', () => {
  const app: express.Application = express();
  let server: http.Server;
  let agent: request.SuperAgentTest;
  let typeormConnection: typeorm.Connection;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);

    initialize.loadRoutersAndUtilities(app);
  });

  beforeEach(async () => {
    await typeormConnection.synchronize(true);

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
    const response = await agent.post('/users/logout');
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('It should return 200, if user was previously logged in', async () => {
    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);
    expect(signupResponse.status).toBe(HttpStatus.OK);

    const loginResponse = await agent.post('/users/login').send(userDetails);
    expect(loginResponse.status).toBe(HttpStatus.OK);

    const authorizationToken = loginResponse.body.session.token;

    const logoutResponse = await agent.post('/users/logout').set({ authorization: authorizationToken });
    expect(logoutResponse.status).toBe(HttpStatus.OK);
  });
});
