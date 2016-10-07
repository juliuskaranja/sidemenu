// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('redAnt', ['ionic','redAnt.controllers','ngAnimate', 'toastr'])

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

.config(function($stateProvider, $urlRouterProvider){
       $stateProvider
           .state('login',{
               url:'/login',
               cache: false,
               templateUrl:'temps/login.html',
               controller:'loginController'
           })
           .state('mainMenu',{
              url:'/mainMenu',
               cache: false,
               templateUrl:'temps/mainMenu.html',
               controller:'mainMenuController'
           })
           .state('register',{
               url:'/register',
               cache: false,
               templateUrl:'temps/register.html',
               controller:'registerController'
           })
           .state('my_job_seekers',{
               url:'/my_job_seekers',
               cache: false,
               templateUrl:'temps/my_job_seekers.html',
               controller:'my_job_seekersController'
           })
           .state('my_profile',{
               url:'/my_profile',
               cache: false,
               templateUrl:'temps/my_profile.html',
               controller:'my_profileController'
           })
           .state('details',{
               url:'/Details/:id',
               cache: false,
               templateUrl:'temps/service_provider_details.html',
               controller:'detailsController'
           })
           .state('partiallyPaidJobSeekers',{
               url:'/partiallyPaidJobSeekers',
               templateUrl:'temps/partiallyPaid.html',
               controller:'partiallyPaidJobSeekersController'
           })
           .state('paidJobSeekers',{
               url:'/paidJobSeekers',
               cache:false,
               templateUrl:'temps/job_openings.html',
               controller:'jobOpeningController'
           });
        $urlRouterProvider.otherwise('/login');

    });
