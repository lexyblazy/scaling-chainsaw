import request from 'supertest';
import HttpStatus from 'http-status-codes';
import express from 'express';
import http from 'http';
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as initialize from '../../../initialize';
import * as utils from '../../../utils';

describe('user.handlers.signup:', () => {
  const app: express.Application = express();
  let server: http.Server;
  let agent: request.SuperAgentTest;
  let typeormConnection: typeorm.Connection;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);
    initialize.loadRouters(app);
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

  it('It should return 400 if user is missing email or password or both', async () => {
    const response = await agent.post('/users/signup').send({ email: 'some' });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toEqual({
      error: 'password is required'
    });

    const response2 = await agent.post('/users/signup').send({ password: 'some_password' });
    expect(response2.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response2.body).toEqual({
      error: 'email is required'
    });

    const response3 = await agent.post('/users/signup').send({});
    expect(response3.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('It should return 400 if email is invalid', async () => {
    const response = await agent.post('/users/signup').send({ email: 'some', password: 'barracks' });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toEqual({
      error: 'Email is invalid'
    });
  });

  it('it should return 400 if email is already in use by another use', async () => {
    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);

    const response = await agent.post('/users/signup').send(userDetails);
    expect(response.status).toBe(HttpStatus.OK);

    const response2 = await agent.post('/users/signup').send({ ...userDetails, password: 'anothr_password' });
    expect(response2.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response2.body).toEqual({ error: 'Email is already in use' });
  });

  it('it should return 200 for new signup', async () => {
    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);

    const response = await agent.post('/users/signup').send(userDetails);
    expect(response.status).toBe(HttpStatus.OK);

    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(response.body.user.email).toBe(userDetails.email);
    expect(response.body.session).toBeDefined();
    expect(response.body.session.token).toBeDefined();
  });
});
