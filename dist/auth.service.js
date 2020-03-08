const AuthService = (() => {
  let TOKEN = null;

  return {
    get myInfo() { return TOKEN.user; },
    signIn(payload) {
      const url = '/rs/auth/sign-in';
      return httpPost(url, payload)
        .then(token => {
          TOKEN = token;
          return Promise.resolve(token);
        });
    },
    signUp(payload) {
      const url = '/rs/auth/sign-up';
      return httpPost(url, payload)
        .then(token => {
          TOKEN = token;
          return Promise.resolve(token);
        });
    },
    signOut() {
      TOKEN = null;
    },
    canActivate(activatedRoute) {
      const isSignInOrSignUpPage = activatedRoute.path === 'sign-in' || activatedRoute.path === 'sign-up';
      const isPermission = !!TOKEN;

      if (isSignInOrSignUpPage && isPermission) {
        location.replace('#home');
        return false;
      }
      if (isSignInOrSignUpPage && !isPermission) {
        return true;
      }

      if (!isSignInOrSignUpPage && isPermission) {
        return true;
      }
      if (!isSignInOrSignUpPage && !isPermission) {
        location.replace('#sign-in');
        return false;
      }
    },
  };

  function httpPost(url, payload, options = {}) {
    const { header } = options;
    const headers = Object.assign({ 'Content-Type': 'application/json' }, header);
    const body = JSON.stringify(payload);

    return fetch(url, { method: 'POST', body, headers })
      .then(res => {
        const isSeccuce = /^2\d{2}$/.test('' + res.status);
        if (isSeccuce) {
          return res.json();
        } else {
          return res.text()
            .then(text => Promise.reject(new Error(`${res.status} ${text}`)))
        }
      });
  }
})();
