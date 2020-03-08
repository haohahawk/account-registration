// @ts-check
/**
 * @typedef {import('../model/auth').User} User
 * @typedef {import('../model/auth').Token} Token
 * @typedef {import('../model/auth').RequestHeaderWithToken} RequestHeaderWithToken
 * @typedef {import('../repository/auth.da').default} AuthDA
 */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ResponseError } from '../lib/http-helper.js';
import JWT_CONFIG from '../../jwt.config.js';

export default class AuthService {
  /**
   * @param {AuthDA} authDA 
   */
  constructor(authDA) {
    this.authDA = authDA;
  }

  /**
   * @param {User} user
   * @returns {Promise<Token>}
   */
  async signIn(user) {
    const isValidFormat = verifyAccountFormat(user);
    if (!isValidFormat) {
      throw new ResponseError({ status: 401, message: 'account format invalid' });
    }

    user = encryptPassword(user);
    const isUser = await this.authDA.isExisit(user);

    if (!isUser) {
      throw new ResponseError({ status: 401, message: 'account or password incorrect' });
    }

    return makeToken(user);
  }

  /**
   * @param {User} user
   * @returns {Promise<Token>}
   */
  async signUp(user) {
    const isValidFormat = verifyAccountFormat(user);
    if (!isValidFormat) {
      throw new ResponseError({ status: 401, message: 'account format invalid' });
    }

    user = encryptPassword(user);
    const isAvailable = !(await this.authDA.isExisit(user));
    if (!isAvailable) {
      throw new ResponseError({ status: 400, message: 'account is been taken' });
    }

    await this.authDA.addOne(user);

    return makeToken(user);
  }

  parseToken(token) {
    const account = { accountId: 'fake-account-id' };
    return account;
  }
}

/**
 * @param {User} user
 * @returns {boolean}
 */
function verifyAccountFormat(user) {
  const isValidAccountId = user
    && user.accountId
    && verifyEmail(user.accountId);
  const isValidPassword = user
    && user.password
    && verifyPassword(user.password);
  return isValidAccountId && isValidPassword;
}
function verifyEmail(str = '') {
  return /^[a-z][\w\.-]*@\w+(\.\w+)+$/.test(str);
}
function verifyPassword(str = '') {
  const isIncludeNumber = /\d/.test(str);
  const isIncludeLowerCase = /[a-z]/.test(str);
  const isIncludeUpperCase = /[A-Z]/.test(str);
  const isNumOrEngAnd8to20 = /^[A-Za-z0-9]{8,20}$/.test(str);
  const isValid = isIncludeNumber
    && isIncludeLowerCase
    && isIncludeUpperCase
    && isNumOrEngAnd8to20;
  return isValid;
}

/**
 * @param {User} user
 * @returns {User} encrypted User
 */
function encryptPassword(user) {
  const result = Object.assign({}, user);
  if (user && user.password) {
    result.password = crypto.createHash('md5')
      .update(user.password + JWT_CONFIG.salt)
      .digest('hex');
  }
  return result;
}

/**
 * @param {User} user
 * @return {Promise<Token>}
 */
function makeToken(user) {
  const payload = {
    iss: user.accountId,
  };
  const token = jwt.sign(payload, JWT_CONFIG.secret, {
    algorithm: 'HS256',
    expiresIn: JWT_CONFIG.increaseTime + 's'
  });
  const result = {
    token,
    tokenType: 'Bearer',
    expiredTime: Date.now() + (JWT_CONFIG.increaseTime * 1000),
    user: {
      accountId: user.accountId
    }
  };

  return Promise.resolve(result);
}

/**
 * @param {RequestHeaderWithToken} header 
 * @returns {any}
 */
function verifyToken(header) {
  if (!header.authorization) {
    return Promise.reject(
      new ResponseError({ status: 401, message: 'no token' })
    );
  }

  const token = header.authorization.split(' ');

  if (token[0] !== 'Bearer') {
    return Promise.reject(
      new ResponseError({ status: 401, message: 'token invalid' })
    );
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token[1], JWT_CONFIG.secret, (err, decoded) => {
      /** @type {any} */
      let result = null;
      if (err) {
        if (err.name === 'TokenExpiredError') {
          result = new ResponseError({ status: 400, message: 'token expired' });
        } else if (err.name === 'JsonWebTokenError') {
          result = new ResponseError({ status: 400, message: 'token invalid' });
        } else {
          result = new ResponseError({ status: 500, message: 'unexpected error' });
        }
      } else {
        result = decoded;
      }

      (result instanceof Error)
        ? reject(result)
        : resolve(result);
    });
  });
}
