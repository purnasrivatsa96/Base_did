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
  beforeAll((done) => { //Before each test we empty the database
    Users.remove({}, (err) => {
      done();
    });
  });

  describe("Sign up", () => {
    test("Create new account", async () => {
      const response = await request
          .post("/users/signup")
          .set('Content-Type', 'application/json')
          .send({username: "abhinav", password: "111"})
          .expect(200);
      // console.log(response.header);
      expect(response.body.status).toBe('Registration Successful!');
      expect(response.body.success).toBe(true);
    });
  })
  var token = null
  describe("Log in", () => {
    test("Log in user fail", async () => {
      const response = await request
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({username: "abhinav2", password: "111"})
          .expect(401);
      // token = response.body.token
      expect(response.body.status).toBe('Login Unsuccessful!');
      expect(response.body.success).toBe(false);
    });
    test("Log in user", async () => {
      const response = await request
          .post("/users/login")
          .set('Content-Type', 'application/json')
          .send({username: "abhinav", password: "111"})
          .expect(200);
      // token = response.body.token
      expect(response.body.status).toBe('Login Successful!');
      expect(response.body.success).toBe(true);
    });

  })

  describe("Log out", () => {
    test("Log out user", async () => {
      const response = await request
          .get("/users/logout");
      // token = response.body.token
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('Bye!');
    });

  })
});
