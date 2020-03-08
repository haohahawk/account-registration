// @ts-check

// handle node callback to promise
// e.g. from(fs.readFile)(path).then(() => {})
export const from = (cb, self) => {
  return function () {
    const args = Array.from(arguments);
    return new Promise((resolve, reject) => {
      const consume = (err, data) => {
        err ? reject(err) : resolve(data);
      };
      cb.apply(self, args.concat(consume));
    });
  };
};
