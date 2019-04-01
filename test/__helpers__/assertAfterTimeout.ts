const assertAfterTimeout = (assertion: any, done: any, timeout: number = 1000) => {
  setTimeout(() => {
    try {
      assertion();
      done();
    } catch (err) {
      done.fail(err);
    }
  }, timeout);
};

export default assertAfterTimeout;
