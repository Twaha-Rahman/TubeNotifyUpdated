function requestIdleCallbackPolyfill(cb: any) {
  var start = Date.now();
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
}

export default requestIdleCallbackPolyfill;
