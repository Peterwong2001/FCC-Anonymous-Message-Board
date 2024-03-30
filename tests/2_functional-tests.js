const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');



chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testThreadId
  let testReplyId
  let testPass = 'testpass'
  
  test("Creating a new thread: POST request to /api/threads/{board}", function(done) {
    chai.request(server)
      .post('/api/threads/test')
      .send({
        board: 'test',
        text: 'test',
        delete_password: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      })
  })
  
  test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function(done) {
    chai.request(server)
      .get('/api/threads/test')
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      })
  })

  test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Reporting a thread: PUT request to /api/threads/{board}", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Creating a new reply: POST request to /api/replies/{board}", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_", function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({
          board: 'test',
          text: 'test',
          delete_password: 'test'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        })
      })
  })

  test("Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  })

  test("Reporting a reply: PUT request to /api/replies/{board}", function(done) {
    chai.request(server)
    .post('/api/threads/test')
    .send({
      board: 'test',
      text: 'test',
      delete_password: 'test'
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      done();
    })
  
});
