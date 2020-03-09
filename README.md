# account-registration

Website login and registration, using Node.JS and MongoDB and JWT and Custom Element.
___

clone and install
```
npm install
```

run web server
```
npm run start
```
open browser

```
http://localhost:8080/
```
___

modify MongoDB settings in "config.js"

```js
[{
  uri: '', // MongoClient uri
  option: {  // MongoClient options
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}];
```