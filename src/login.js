const $login = $('.login');
const $loginWrapper = $('.login-wrapper');
const $loadingWrapper = $('.loading-wrapper');


// $login.on('click', FirebaseApi.signIn);

$login.on('click', FirebaseApi.signIn);

FirebaseApi.setOnLoginListener(() => {
  $loginWrapper.addClass('display-none');
  $loadingWrapper.removeClass('display-none');
});

FirebaseApi.setOnPageUpdateListener(() => {
  window.location.replace("soo");
});