const $textarea = $('textarea');
const $loadingWrapper = $('.loading-wrapper');
const $chatWrapper = $('.chat-wrapper');
const $logout = $('.header-status');
const $mainChatting = $('.main-chatting');
const $uploadButton = $('#uploadButton');
const $uploadFile = $('#uploadFile');
const messages = {};

const messageTemplate = `<div class="chat-content">
    <div class="chat-image-zone">
        <div class="chat-image">Name[0]</div>
        <div class="i fas fa-cog left-cog display-none"></div>
    </div>
    <div class="chat">
        <div class="chat-profile-content">
            <div class="profile-name">displayName</div>
            <div class="profile-owner-content">
                <div class="owner-text admin">Admin</div>
                <div class="owner-text owner">Owner</div>
            </div>
            <div class="profile-date">time</div>
            <div class="i fas fa-cog right-cog"></div>
        </div>
        <div class="chat-text-content">
          <div class="file-content">
              <div class="file-header">
                  <div class="file-name">filename</div>
                  <div class="i fas fa-download download"></div>
                  <div class ="i fas fa-sort-down down-arrow"></div>
              </div>
              <div class="file i fas fa-file"></div>
          </div>
      </div>
    </div>
  </div>`;

const dateTemplate = `<div class="chat-date">
      <div class="date-line"></div>
      <div class="date-text">date</div>
      <div class="date-line"></div>
  </div>`;

let currentUser = null;

$uploadButton.on('click', () => {
  $uploadFile.trigger('click');
});

$uploadFile.on('change', (e) => {
  console.log(e.target.files);
  FirebaseApi.uploadFileData(e.target.files);
});

$textarea.on('keyup', (e) => {
  let val = $textarea.val();
  
  if (e.keyCode === 13 && !e.shiftKey) {
    val = val.replace(/(?:\r\n|\r|\n)/g, '<br />');
    if (val !== "<br />" && val !== "↵" && val !== " ") {
      FirebaseApi.sendMessage(val, 'text');
    }
    $textarea.val('');
  }
  
});

$logout.on('click', FirebaseApi.signOut);

FirebaseApi.setOnLoginListener(() => {
  window.location.replace("login");
});

FirebaseApi.setOnPageUpdateListener((user) => {
  
  currentUser = user;
  $('.header-image').addClass(user.color);
  $('.header-image').text(currentUser.displayName[0]);
  $('.header-name').text(currentUser.displayName);
  
  FirebaseDB.update('general');
  
  $loadingWrapper.addClass('display-none');
  $chatWrapper.removeClass('display-none');
  
});

FirebaseApi.setOnUpdateContentListener((data) => {
  const ele = new Element(data);
  messages[data.date] = data;
  
  if (lastElement !== null) {
    lastElement.next(ele);
    ele.prev(lastElement);
  }
  lastElement = ele;
  
  $mainChatting.scrollTop($mainChatting[0].scrollHeight);
  
});
let lastElement = null;
const Element = function Element(user) {
  
  const that = this;
  this.currentUser = user;
  const time = new Date(user.date * 1);
  this.dateString = `${time.getHours() > 12 ? '오후' : '오전'} ${time.getHours() % 12}:${time.getMinutes()}`
  checkDate(time);
  
  const $ele = $(messageTemplate);
  if (user.type === 'text') {
    $ele.find('.file-content').addClass('display-none');
    $ele.find('.chat-text-content').html(user.message);
  }
  else {
    $ele.find('.file-name').html(user.message);
  }
  
  
  $ele.attr('id', user.date);
  $ele.find('.chat-image').addClass(user.color);
  $ele.find('.chat-image').text(user.displayName[0]);
  $ele.find('.profile-name').text(user.displayName);
  $ele.find('.profile-date').text(that.dateString);
  
  
  let prev = null;
  this.prev = (ele) => {
    if (_.isNil(ele)) return prev;
    prev = ele;
    that.update();
  };
  
  let next = null;
  this.next = (ele) => {
    if (_.isNil(ele)) return next;
    next = ele;
    that.update();
  };
  
  this.update = () => {
    if (prev !== null
      && prev.currentUser.displayName === that.currentUser.displayName
      && prev.dateString === that.dateString) {
      $ele.find('.left-cog').removeClass('display-none');
      $ele.find('.right-cog').addClass('display-none');
      $ele.find('.chat-image').addClass('display-none');
      $ele.find('.chat-profile-content').addClass('display-none');
    }
  };
  
  
  $mainChatting.append($ele);
  user.ele = $ele;
  
  $ele.find('.download').on('click', () => {
    FirebaseDB.downloadFile(user);
  });
  
  $ele.find('.down-arrow').on('click', ()=>{
    if(!$ele.find('.chat-text-content').hasClass('close-file')){
      $ele.find('.down-arrow').removeClass('fa-sort-down');
      $ele.find('.down-arrow').addClass('fa-caret-right');
      $ele.find('.chat-text-content').addClass('close-file');
    }
    else {
      $ele.find('.down-arrow').addClass('fa-sort-down');
      $ele.find('.down-arrow').removeClass('fa-caret-right');
      $ele.find('.chat-text-content').removeClass('close-file');
    }
  
  });
  
  return this;
};

let dateString = null;

function checkDate(time) {
  
  const date = time.toDateString().split(" ");
  const month = date[1];
  const day = date[2];
  const year = date[3];
  
  const thisDateString = month + '  ' + day + '  ' + year;
  
  if (dateString !== thisDateString) {
    dateString = thisDateString;
    const $ele = $(dateTemplate);
    $ele.find('.date-text').text(dateString);
    $mainChatting.append($ele);
  }
  
}