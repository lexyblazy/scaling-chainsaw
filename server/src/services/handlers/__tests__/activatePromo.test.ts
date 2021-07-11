import request from 'supertest';
import HttpStatus from 'http-status-codes';
import express from 'express';
import http from 'http';
import _ from 'lodash';
import * as typeorm from 'typeorm';
import * as initialize from '../../../initialize';
import * as utils from '../../../utils';
import * as schemas from '../../../schemas';

describe('services.handlers.activatePromo', () => {
  const app: express.Application = express();
  let server: http.Server;
  let agent: request.SuperAgentTest;
  let typeormConnection: typeorm.Connection;
  let servicesRepository: typeorm.Repository<schemas.ServiceEntity>;
  let promoCodesRepository: typeorm.Repository<schemas.PromoCodeEntity>;

  beforeAll(async () => {
    typeormConnection = await utils.tests.helpers.createTypeormConnection();
    await typeormConnection.synchronize(true);
    servicesRepository = typeormConnection.getRepository(schemas.service);
    promoCodesRepository = typeormConnection.getRepository(schemas.promoCode);

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
    const response = await agent.post('/services/activate-promo');
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('It should return bad request if the promoCode is not sent', async () => {
    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);
    expect(signupResponse.status).toBe(HttpStatus.OK);

    const authorizationToken = signupResponse.body.session.token;
    const activatePromoResponse = await agent.post('/services/activate-promo').set({ authorization: authorizationToken });

    expect(activatePromoResponse.status).toBe(HttpStatus.BAD_REQUEST);
    expect(activatePromoResponse.body).toEqual({ error: 'Promo code is missing' });
  });

  it('An authenticated user should be able to activate a valid promo code', async () => {
    const service = await servicesRepository.save(utils.tests.fakes.service);
    const promoCode = await promoCodesRepository.save({ ...utils.tests.fakes.promoCode, service });

    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);

    const authorizationToken = signupResponse.body.session.token;
    const activatePromoResponse = await agent
      .post('/services/activate-promo')
      .set({ authorization: authorizationToken })
      .send({ code: promoCode.code });

    expect(activatePromoResponse.status).toBe(HttpStatus.OK);
    expect(activatePromoResponse.body).toBeDefined();
  });

  it('A user should not be able to activate a promo with an inactive code', async () => {
    const service = await servicesRepository.save(utils.tests.fakes.service);
    const promoCode = await promoCodesRepository.save({ ...utils.tests.fakes.promoCode, status: 'canceled', service });

    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);

    const authorizationToken = signupResponse.body.session.token;
    const activatePromoResponse = await agent
      .post('/services/activate-promo')
      .set({ authorization: authorizationToken })
      .send({ code: promoCode.code });

    expect(activatePromoResponse.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(activatePromoResponse.body).toEqual({ error: 'This promotion is not active' });
  });

  it('A user should not be able to activate a promo twice', async () => {
    const service = await servicesRepository.save(utils.tests.fakes.service);
    const promoCode = await promoCodesRepository.save({ ...utils.tests.fakes.promoCode, service });

    const userDetails = _.pick(utils.tests.fakes.user, ['email', 'password']);
    const signupResponse = await agent.post('/users/signup').send(userDetails);

    const authorizationToken = signupResponse.body.session.token;
    const activatePromoResponse = await agent
      .post('/services/activate-promo')
      .set({ authorization: authorizationToken })
      .send({ code: promoCode.code });

    expect(activatePromoResponse.status).toBe(HttpStatus.OK);
    expect(activatePromoResponse.body).toBeDefined();

    const secondActivationResponse = await agent
      .post('/services/activate-promo')
      .set({ authorization: authorizationToken })
      .send({ code: promoCode.code });

    expect(secondActivationResponse.status).toBe(HttpStatus.FORBIDDEN);
    expect(secondActivationResponse.body.existingActivePromoActivation).toBeTruthy();
    expect(secondActivationResponse.body.error).toBe('You already have an existing active promo for this code');
  });
});
