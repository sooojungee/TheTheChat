'use strict';

var $textarea = $('textarea');
var $loadingWrapper = $('.loading-wrapper');
var $chatWrapper = $('.chat-wrapper');
var $logout = $('.header-status');
var $mainChatting = $('.main-chatting');
var $uploadButton = $('#uploadButton');
var $uploadFile = $('#uploadFile');
var messages = {};

var messageTemplate = '<div class="chat-content">\n    <div class="chat-image-zone">\n        <div class="chat-image">Name[0]</div>\n        <div class="i fas fa-cog left-cog display-none"></div>\n    </div>\n    <div class="chat">\n        <div class="chat-profile-content">\n            <div class="profile-name">displayName</div>\n            <div class="profile-owner-content">\n                <div class="owner-text admin">Admin</div>\n                <div class="owner-text owner">Owner</div>\n            </div>\n            <div class="profile-date">time</div>\n            <div class="i fas fa-cog right-cog"></div>\n        </div>\n        <div class="chat-text-content">\n          <div class="file-content">\n              <div class="file-header">\n                  <div class="file-name">filename</div>\n                  <div class="i fas fa-download download"></div>\n                  <div class ="i fas fa-sort-down down-arrow"></div>\n              </div>\n              <div class="file i fas fa-file"></div>\n          </div>\n      </div>\n    </div>\n  </div>';

var dateTemplate = '<div class="chat-date">\n      <div class="date-line"></div>\n      <div class="date-text">date</div>\n      <div class="date-line"></div>\n  </div>';

var currentUser = null;

$uploadButton.on('click', function () {
  $uploadFile.trigger('click');
});

$uploadFile.on('change', function (e) {
  console.log(e.target.files);
  FirebaseApi.uploadFileData(e.target.files);
});

$textarea.on('keyup', function (e) {
  var val = $textarea.val();

  if (e.keyCode === 13 && !e.shiftKey) {
    val = val.replace(/(?:\r\n|\r|\n)/g, '<br />');
    if (val !== "<br />" && val !== "↵" && val !== " ") {
      FirebaseApi.sendMessage(val, 'text');
    }
    $textarea.val('');
  }
});

$logout.on('click', FirebaseApi.signOut);

FirebaseApi.setOnLoginListener(function () {
  window.location.replace("login");
});

FirebaseApi.setOnPageUpdateListener(function (user) {

  currentUser = user;
  $('.header-image').addClass(user.color);
  $('.header-image').text(currentUser.displayName[0]);
  $('.header-name').text(currentUser.displayName);

  FirebaseDB.update('general');

  $loadingWrapper.addClass('display-none');
  $chatWrapper.removeClass('display-none');
});

FirebaseApi.setOnUpdateContentListener(function (data) {
  var ele = new Element(data);
  messages[data.date] = data;

  if (lastElement !== null) {
    lastElement.next(ele);
    ele.prev(lastElement);
  }
  lastElement = ele;

  $mainChatting.scrollTop($mainChatting[0].scrollHeight);
});
var lastElement = null;
var Element = function Element(user) {

  var that = this;
  this.currentUser = user;
  var time = new Date(user.date * 1);
  this.dateString = (time.getHours() > 12 ? '오후' : '오전') + ' ' + time.getHours() % 12 + ':' + time.getMinutes();
  checkDate(time);

  var $ele = $(messageTemplate);
  if (user.type === 'text') {
    $ele.find('.file-content').addClass('display-none');
    $ele.find('.chat-text-content').html(user.message);
  } else {
    $ele.find('.file-name').html(user.message);
  }

  $ele.attr('id', user.date);
  $ele.find('.chat-image').addClass(user.color);
  $ele.find('.chat-image').text(user.displayName[0]);
  $ele.find('.profile-name').text(user.displayName);
  $ele.find('.profile-date').text(that.dateString);

  var prev = null;
  this.prev = function (ele) {
    if (_.isNil(ele)) return prev;
    prev = ele;
    that.update();
  };

  var next = null;
  this.next = function (ele) {
    if (_.isNil(ele)) return next;
    next = ele;
    that.update();
  };

  this.update = function () {
    if (prev !== null && prev.currentUser.displayName === that.currentUser.displayName && prev.dateString === that.dateString) {
      $ele.find('.left-cog').removeClass('display-none');
      $ele.find('.right-cog').addClass('display-none');
      $ele.find('.chat-image').addClass('display-none');
      $ele.find('.chat-profile-content').addClass('display-none');
    }
  };

  $mainChatting.append($ele);
  user.ele = $ele;

  $ele.find('.download').on('click', function () {
    FirebaseDB.downloadFile(user);
  });

  $ele.find('.down-arrow').on('click', function () {
    if (!$ele.find('.chat-text-content').hasClass('close-file')) {
      $ele.find('.down-arrow').removeClass('fa-sort-down');
      $ele.find('.down-arrow').addClass('fa-caret-right');
      $ele.find('.chat-text-content').addClass('close-file');
    } else {
      $ele.find('.down-arrow').addClass('fa-sort-down');
      $ele.find('.down-arrow').removeClass('fa-caret-right');
      $ele.find('.chat-text-content').removeClass('close-file');
    }
  });

  return this;
};

var dateString = null;

function checkDate(time) {

  var date = time.toDateString().split(" ");
  var month = date[1];
  var day = date[2];
  var year = date[3];

  var thisDateString = month + '  ' + day + '  ' + year;

  if (dateString !== thisDateString) {
    dateString = thisDateString;
    var $ele = $(dateTemplate);
    $ele.find('.date-text').text(dateString);
    $mainChatting.append($ele);
  }
}