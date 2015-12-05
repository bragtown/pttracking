angular.module('firebase.config', [])
  .constant('FBURL', 'https://sweltering-heat-6104.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');
