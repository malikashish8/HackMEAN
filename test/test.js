'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');

var config = require('config');

var logger = require('../config/logger')
var User = require('../api/hackmean_model').User;
var expect = chai.expect;
var api_url = "http://127.0.0.1:" + config.listenPort;

chai.use(chaiHttp);

// Unit Tests
before(() => {
  logger.info("logging in for authenticated testing")

  chai.request(api_url)
    .post('/login').send("username=Joe&password=jo123")
    .end((err, res) => {
      expect(res).to.have.status(200);
    })
})

describe('/user' , () => {
  it('/GET user - it should get users list', () => {
    chai.request(api_url)
      .get('/user')
      .end((err, res)=> {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });
  it('/POST user - should create user for valid request', () => {
    var newUser = {
      'username': 'foo', 
      'password': 'foo@1234',
      'email': "foo@example.com" 
    };
    chai.request(api_url)
      .post('/user')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
  it('/GET user/:user - should get user', () => {
    chai.request(api_url)
      .get('/user/foo')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
  it('/GET user/:user - should reject invalid request', () => {
    chai.request(api_url)
      .get('/user/does_not_exist')
      .end((err, res) => {
        expect(res).to.have.status(400);
      });
  });
  it('/PUT user/:user - should update user', () => {
    var updateUser = {
      'password': 'foo@1234',
      'newPassword': 'foo@example.com'
    };
    chai.request(api_url)
      .put('/user/foo')
      .send(updateUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
  it('/PUT user/:user - should reject invalid update', () => {
    var updateUser = {
      'password': 'dont_know',
      'newPassword': 'foo@example.com'
    };
    chai.request(api_url)
      .put('/user/foo')
      .send(updateUser)
      .end((err, res) => {
        expect(res).to.have.status(401);
      });
  });
  it('/DEL user/:user - should delete user', () => {
    chai.request(api_url)
      .del('/user/foo')
      .end((err, res)=> {
        expect(res).to.have.status(200);
      });
  });
  it('/DEL user/:user - should fail if user does not exist', () => {
    chai.request(api_url)
      .del('/user/foo')
      .end((err, res)=> {
        expect(res).to.have.status(400);
      });
  });
});

describe('/post', () => {
  it('GET /post - it should get post list', () => {
    chai.request(api_url)
      .get('/post')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });
});

describe('/comment', () => {
  it('GET /comment - it should get comment list', () => {
    chai.request(api_url)
      .get('/comment')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  })
})

after( () => {
  // Stop WS after testing
  console.log('testing complete')
})