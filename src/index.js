// @ts-check

import http from 'http';
import path from 'path';
import fs from 'fs';
import { from } from './lib/util.js';
import DBInjector from './lib/db-injector.js';
import FileHelper from './lib/file-helper.js';

import AuthDA from './repository/auth.da.js';
import AuthService from './use-case/auth.service.js';
import { getRequestJson, ResponseError, consumeError, sendResponseJson } from './lib/http-helper.js';
import DB_CONFIG from '../db.config.js';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && (req.url === '/' || FileHelper.isSupport(req.url))) {
    const reqURL = req.url === '/'
      ? './dist/index.html'
      : `./dist${req.url}`;
    const filePath = path.resolve(reqURL);
    const contentType = FileHelper.getMIME(filePath);

    console.log('readFile', filePath, contentType);
    try {
      const data = await from(fs.readFile)(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(data.toString());
      res.end();
    } catch (err) {
      consumeError(res, err);
    }
  } else if (req.method === 'POST' && req.url === '/rs/auth/sign-up') {
    console.log(req.url);
    try {
      const userCollection = await DBInjector.getCollection({
        client: 'default',
        db: 'testDB',
        collection: 'Users',
      });
      const authDA = new AuthDA(userCollection);
      const authService = new AuthService(authDA);

      const user = await getRequestJson(req);
      const token = await authService.signUp(user);

      sendResponseJson(res, token, {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
      });
    } catch (err) {
      consumeError(res, err);
    }
  } else if (req.method === 'POST' && req.url === '/rs/auth/sign-in') {
    console.log(req.url);
    try {
      const userCollection = await DBInjector.getCollection({
        client: 'default',
        db: 'testDB',
        collection: 'Users',
      });
      const authDA = new AuthDA(userCollection);
      const authService = new AuthService(authDA);

      const user = await getRequestJson(req);
      const token = await authService.signIn(user);

      sendResponseJson(res, token, {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
      });
    } catch (err) {
      consumeError(res, err);
    }
  } else {
    const err = new ResponseError({ status: 404, message: 'Oppps, Lost in space...'});
    consumeError(res, err);
  }
});

DBInjector.forRoot(DB_CONFIG);
server.listen(8080);
console.log('localhost:8080 is running.');
