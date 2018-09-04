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
        <div class="i fas fa-cog display-none"></div>
    </div>
    <div class="chat">
        <div class="chat-profile-content">
            <div class="profile-name">displayName</div>
            <div class="profile-owner-content">
                <div class="owner-text admin">Admin</div>
                <div class="owner-text owner">Owner</div>
            </div>
            <div class="profile-date">time</div>
            <div class="i fas fa-cog"></div>
        </div>
        <div class="chat-text-content">
          <div class="file-content">
              <div class="file-header">
                  <div class="file-name">filename</div>
                  <div class="i fas fa-download download"></div>
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
  messages.ele = new Element(data);
  messages[data.signAt] = data;
  
  $mainChatting.scrollTop($mainChatting[0].scrollHeight);
  
  
});

const Element = function Element(user) {
  
  const time = new Date(user.date * 1);
  checkDate(time);
  const dateString = `${time.getHours() > 12 ? '오후' : '오전'} ${time.getHours() % 12}:${time.getMinutes()}`
  
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
  $ele.find('.profile-date').text(dateString);
  
  $mainChatting.append($ele);
  user.ele = $ele;
  
  $ele.find('.download').on('click', () => {
    FirebaseDB.downloadFile(user);
  });
  
};

let dateString = null;
function checkDate(time) {
  
  const date = time.toDateString().split(" ");
  const month = date[1];
  const day = date[2];
  const year = date[3];
  
  const thisDateString = month + '  ' + day + '  ' + year;
  
  if(dateString !== thisDateString){
    dateString = thisDateString;
    const $ele = $(dateTemplate);
    $ele.find('.date-text').text(dateString);
    $mainChatting.append($ele);
  }
  
}