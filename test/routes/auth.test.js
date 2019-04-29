require('../utils/data-helper');
const request = require('supertest');
const app = require('../../lib/app');

describe('auth route tests', () => {

  it('signs up an admin', () => {
    return request(app)
      .post('/api/v1/auth/signup/admin')
      .send({ name: 'taco dan', password: 'sneakyPhrase32', phone: '2345678901' })
      .then(res => {
        expect(res.body).toEqual({
          name: 'taco dan', 
          role: 'admin',
          phone: '2345678901',
          _id: expect.any(String),
          profile: null
        });
      });
  });

  it.only('signs up a customer', () => {
    return request(app)
      .post('/api/v1/auth/signup/customer')
      .send({ name: 'customer dan', password: 'letMeIn', phone: '8888888888' })
      .then(res => {
        expect(res.body).toEqual({
          name: 'customer dan',
          phone: '8888888888',
          role: 'customer',
          _id: expect.any(String),
          profile: {
            _id: expect.any(String),
            rewards: 0
          }
        });
      });
  });

  it('signs in a user', () => {
    
  });

});
