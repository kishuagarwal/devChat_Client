// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('devChat', ['ionic', 'ui.router', 'ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('splash', {
      url:'/splash',
      templateUrl: 'templates/splash.html',
      controller: 'SplashCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })
    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .state('home.settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
    .state('home.chats', {
      url: '/chats', 
      templateUrl: 'templates/chats.html',
      controller: 'ChatsCtrl'
    })
    .state('home.questions', {
      url: '/questions',
      templateUrl: 'templates/questions.html',
      controller: 'QuestionsCtrl'
    })
    .state('chat', {
<<<<<<< HEAD
      url: '/chat/:with',
=======
      url: '/chat/:chatId',
>>>>>>> initial commit
      templateUrl: 'templates/chat.html',
      controller: 'ChatCtrl'
    })
    ;
    $urlRouterProvider.otherwise('/splash');
});