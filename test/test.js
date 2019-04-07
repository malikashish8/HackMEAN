'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http')

var User = require('../api/hackmean_model').User;
var expect = chai.expect;
var api_url = "http://127.0.0.1:" + gConfig.listenPort;

chai.use(chaiHttp);


// Unit Tests
describe('/GET user', function() {
  it('it should get users list', ()=> {
    chai.request(api_url)
      .get('/user')
      .end((req, res)=> {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      })
  });
});

describe('/POST user' , () => {
  var newUser = new User({ 
    'username': 'foo', 
    'password': 'foo@1234',
    'email': "foo@example.com" 
  });
  it('it should add user for valid request', () => {
    chai.request(api_url)
      .post('/user')
      .send(newUser)
      .end((req, res) => {
        expect(res).to.have.status(200);
      });
  });
});

describe('/GET post', () => {
  it('it should get post list', () => {
    chai.request(api_url)
      .get('/post')
      .end((req, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  });
});

describe('/GET comment', () => {
  it('it should get comment list', () => {
    chai.request(api_url)
      .get('/comment')
      .end((req, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
      });
  })
})

after( () => {
  // Stop WS after testing

})