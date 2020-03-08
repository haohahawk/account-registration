// @ts-check
/**
 * @typedef {import('../model/auth').User} User
 * @typedef {import('mongodb').Collection<User>} UserCollection
 */

export default class AuthDA {

  /**
   * @param {UserCollection} collection 
   */
  constructor(collection) {
    this.collection = collection;
  }

  /**
   * @param {User} user
   * @return {Promise<boolean>}
   */
  isExisit(user) {
    return this.collection.findOne(user)
      .then(doc => Promise.resolve(!!doc));
  }

  /**
   * @param {User} user
   * @return {Promise<any>}
   */
  addOne(user) {
    return this.collection.insertOne(user);
  }
}

