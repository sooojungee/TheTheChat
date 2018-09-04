'use strict';

var $login = $('.login');
var $loginWrapper = $('.login-wrapper');
var $loadingWrapper = $('.loading-wrapper');

// $login.on('click', FirebaseApi.signIn);

$login.on('click', FirebaseApi.signIn);

FirebaseApi.setOnLoginListener(function () {
  $loginWrapper.addClass('display-none');
  $loadingWrapper.removeClass('display-none');
});

FirebaseApi.setOnPageUpdateListener(function () {
  window.location.replace("soo");
});