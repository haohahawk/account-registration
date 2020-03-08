// @ts-check
/**
 * @typedef {Object} DBQueryParams
 * @property {string} client
 * @property {string} [db]
 * @property {string} [collection]
 */

import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

class MongoDBInjector {
  constructor() { }

  forRoot(config) {
    this.config = config;
  }

  getClient({ client }) {
    const config = this.getConfig({ client });
    if (config.instance) {
      return Promise.resolve(config.instance);
    }
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.uri, config.options, (err, clientInstance) => {
        if (err) {
          reject(err);
        } else {
          config.instance = clientInstance;
          resolve(config.instance);
        }
      });
    });
  }

  getDB({ client, db }) {
    const config = this.getConfig({ client, db });
    return this.getClient({ client })
      .then(clientInstance => {
        if (!config.instance) {
          config.instance = clientInstance.db(db);
        }
        return Promise.resolve(config.instance);
      });
  }

  getCollection({ client, db, collection }) {
    const config = this.getConfig({ client, db, collection });
    return this.getDB({ client, db })
      .then(dbInstance => {
        return new Promise((resolve, reject) => {
          dbInstance.collection(collection, (err, collectionInstance) => {
            if (err) {
              reject(err)
            } else {
              config.instance = collectionInstance;
              resolve(collectionInstance);
            }
          });
        });
      });
  }

  /**
   * @param {DBQueryParams} params
   */
  getConfig({ client, db, collection }) {
    let config = this.config.find(c => c.name === client);
    if (!config) {
      throw new Error(`not found ClientConfing '${client}'`);
    }
    if (config && db) {
      config = config.db.find(c => c.name === db);
      if (!config) {
        throw new Error(`not found DBConfig '${db}'`);
      }
    }
    if (config && collection) {
      config = config.collection.find(c => c.name === collection);
      if (!config) {
        throw new Error(`not found CollectConfig '${collection}'`);
      }
    }
    return config;
  }
}

const DBInjector = new MongoDBInjector();

export default DBInjector;
