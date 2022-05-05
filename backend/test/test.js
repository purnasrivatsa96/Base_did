'use strict';

const request = require("supertest");
const app = require('../app');
const Users = require("../models/user")
const supertest = require("supertest");


const server = app.listen();

afterAll(async () => {
  await app.terminate();
});

describe('Error', () => {
  const request = supertest(server);

  describe('UNKNOWN_ENDPOINT', () => {
    it('<404> should reject the request with no-exist API endpoint', async () => {
      const testCases = [
        '/users/signup'
      ];

      for (const path  of testCases) {
        const res = await request
          .get(path)
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(404);
      }
    });
  });

  describe('INVALID_REQUEST_BODY_FORMAT', () => {
    it('<400> should reject the request body with invalid JOSN format', async () => {
      const testCases = [
        ['/', 'a[]'],
        ['/users', '{[}]'],
        ['/users/login', '1+1'],
      ];

      for (const [path, body] of testCases) {
        const res = await request
          .post(path)
          .set('Content-Type', 'application/json')
          .send(body)
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(400);
      }
    });
  });
});

describe('Users', () => {

  const request = supertest(server);
  beforeEach((done) => { //Before each test we empty the database
    Users.remove({}, (err) => {
      done();
    });
  });

  describe("GET /users", () => {
    test("It responds with an array of students", async () => {
      const response = await request
          .post("/users/signup")
          .set('Content-Type', 'application/json')
          .send({username: "abhinav", password: "111"});
      // console.log(response.body);
      expect(response.body.status).toBe('Registration Successful!');
      expect(response.body.success).toBe(true);
    });
  })
});
