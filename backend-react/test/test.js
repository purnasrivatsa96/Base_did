'use strict';

const request = require("supertest");
const app = require('../app');
const Users = require("../models/user")
const supertest = require("supertest");


const server = app.listen();
const code = 401;
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
  describe("PUT /repositories", () => {
    test("Updating repo", async () => {
      const response = await request
          .put("/repositories")
          .set('Content-Type', 'application/json')
      expect(response.statusCode).toBe(code);
    });
  });

  describe("delete /repositories", () => {
    test("Updating repo", async () => {
      const response = await request
          .delete("/repositories")
      expect(response.statusCode).toBe(code);
    });
  });

  describe("post /repositories", () => {
    test("Updating repo", async () => {
      const response = await request
          .post("/repositories")
      expect(response.statusCode).toBe(code);
    });
  });

  describe("put /repositories", () => {
    test("Updating repo", async () => {
      const resp1 = await request
        .post("/users/signup")
        .set('Content-Type', 'application/json')
        .send({username: "nivi", password: "aa"});
        const token = "Bearer " + resp1.token;
        const resp2 = await request
        .post("/repositories")
        .set('Content-Type', 'application/json', 'Authorization', token)
        .send({username: "nivi", password: "aa"});
      const response = await request
          .put("/repositories")
          .set('Content-Type', 'application/json', 'Authorization', token)
      expect(response.statusCode).toBe(code);
    });
  });

  describe("post /repositories", () => {
    test("Updating repo", async () => {
      const resp1 = await request
        .post("/users/signup")
        .set('Content-Type', 'application/json')
        .send({username: "nivi", password: "aa"});
        const token = "Bearer " + resp1.token;
        const resp2 = await request
        .post("/repositories")
        .set('Content-Type', 'application/json', 'Authorization', token)
        .send({username: "nivi", password: "aa"});
      const response = await request
          .post("/repositories")
          .set('Content-Type', 'application/json', 'Authorization', token)
          .send({name: "sampleRepo", user: "nivi", papers: []});
      expect(response.statusCode).toBe(code);
    });
  });

  describe("delete /repositories", () => {
    test("Updating repo", async () => {
      const resp1 = await request
        .post("/users/signup")
        .set('Content-Type', 'application/json')
        .send({username: "nivi", password: "aa"});
        const token = "Bearer " + resp1.token;
        const resp2 = await request
        .post("/repositories")
        .set('Content-Type', 'application/json', 'Authorization', token)
        .send({username: "nivi", password: "aa"});
      const response = await request
          .delete("/repositories")
          .set('Content-Type', 'application/json', 'Authorization', token)
          .send({name: "sampleRepo", user: "nivi", papers: []});
      expect(response.statusCode).toBe(code);
    });
  });
});

