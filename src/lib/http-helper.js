// @ts-check
import FileHelper from './file-helper.js';

export class ResponseError extends Error {
  constructor({ status, message }) {
    super(message);
    this.status = status;
  }
}

/**
 * @param {import('http').IncomingMessage} req
 */
export const getRequestJson = function (req) {
  return new Promise((resolve, reject) => {
    const data = [];
    req.on('data', chunk => {
      data.push(chunk)
    });
    req.on('end', () => {
      // @ts-ignore
      const json = JSON.parse(data);
      resolve(json);
    });
  });
};

/**
 * @param {import('http').ServerResponse} res 
 * @param {Object} obj 
 * @param {Object} [header]
 */
export const sendResponseJson = function (res, obj, header) {
  const { status = 200, ...restHeader } = header;
  const h = {
    'Content-Type': FileHelper.getMIME('json'),
    ...restHeader
  };
  res.writeHead(status, h);
  res.write(JSON.stringify(obj));
  res.end();
}

/**
 * @param {import('http').ServerResponse} res 
 * @param {ResponseError | Error | any} error 
 */
export const consumeError = function (res, error) {
  let status = 500;
  let errorMessage = 'internal error';

  console.error(error);

  if (error instanceof ResponseError) {
    status = error.status;
    errorMessage = error.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message || errorMessage;
  } else {
    errorMessage = ('' + error) || errorMessage
  }
  res.writeHead(status, { 'Content-Type': FileHelper.getMIME('txt') });
  res.write(status + ' ' +errorMessage);
  res.end();
};
