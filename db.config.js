const DB_CONFIG = [{
  name: 'default',
  uri: 'mongodb://localhost:27017/testDB',
  option: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  db: [{
    name: 'testDB',
    collection: [{
      name: 'Users',
    }]
  }]
}];

export default DB_CONFIG;