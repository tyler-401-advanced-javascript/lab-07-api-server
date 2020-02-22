const server = require('../lib/server.js');
const supertest = require('supertest');

//create a mock for the imported server object.
const mockRequest = supertest(server.server);

// describe('It should start the server successfully ', () => {
//   it('It should start', () => {
//     server.start();
//     jest.spyOn(global.console, 'log');
//     expect(console.log).toHaveBeenCalledWith('Listening to you on port 3000');
//   })
// })

describe('It should respond correctly to a GET request', () => {
  it('It should do the thing with the get.', () => {
    return mockRequest
      .get('/categories')
      .then((results) => {
        expect(results.status).toBe(200);
      })
  })
})

describe('POST routes', () => {
  it('It should not post something with an invalid name', () => {
    return mockRequest
      .post('/categories')
      .send({ name: 1 })
      .then((results) => {
        expect(results.status).toBe(406);
      })
  })
  it('It should post something with a valids input', () => {
    return mockRequest
      .post('/categories')
      .send({ name: 'cycling' })
      .then((results) => {
        expect(results.status).toBe(201);
      })
  })
  it('It should not post a duplicate name', () => {
    return mockRequest
      .post('/categories')
      .send({ name: 'cycling' })
      .then((results) => {
        expect(results.status).toBe(406);
      })
  })
  it('It should POST to products with well formatted input', () => {
    return mockRequest
      .post('/products')
      .send({ name: 'paddleboard', category: 3 })
      .then((results) => {
        expect(results.status).toBe(201);
      })
      .then(() => {
        return mockRequest
          .post('/products')
          .send({ name: 'kayak' })
          .then((results) => {
            expect(results.status).toBe(201);
          })
      })
  })
  it('It should not POST to products with bad input', () => {
    return mockRequest
      .post('/products')
      .send({ name: '', category: 'hi' })
      .then(results => {
        expect(results.status).toBe(406);
      })
  })
})

describe('PUT routes.', () => {
  it('It should update a resource with good input', () => {
    return mockRequest
      .put('/categories/1')
      .send({name: 'eating'})
      .then(results => {
        expect(results.status).toBe(202)
      })
  })
  it('It should update a product given good input', () => {
    return mockRequest
      .put('/products/1')
      .send({name: 'eating'})
      .then(results => {
        expect(results.status).toBe(202)
      })
  })
  it('It should not update a resource with bad input', () => {
    return mockRequest
      .put('/categories/1')
      .send({badKey: 23434})
      .then(results => {
        expect(results.status).toBe(406)
      })
  })
  it('It should not update a product with bad input', () => {
    return mockRequest
      .put('/product/1')
      .send({name: ''})
      .then(results => {
        expect(results.status).toBe(406)
      })
  })
})