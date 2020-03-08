# account-registration

Website login and registration, using Node.JS and MongoDB and JWT and Custom Element.
___

clone and run web server
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
  uri: '', // custom MongoClient uri
  option: {  // costom MongoClient options
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
}];
```