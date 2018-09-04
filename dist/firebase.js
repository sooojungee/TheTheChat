"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = {
  apiKey: "AIzaSyDBv_zL-BHPtXOpFxTes0cv7BpYZ4PckeE",
  authDomain: "chat-1bdde.firebaseapp.com",
  databaseURL: "https://chat-1bdde.firebaseio.com",
  projectId: "chat-1bdde",
  storageBucket: "chat-1bdde.appspot.com",
  messagingSenderId: "188963284072"
};

firebase.initializeApp(config);

var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();
var store = firebase.firestore();
var storage = firebase.storage();

var storageRef = storage.ref();
var settings = { timestampsInSnapshots: true };
store.settings(settings);

var color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

var FirebaseDB = {

  createUser: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
      var num, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              num = Math.floor(Math.random() * color.length) + 1;
              data = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().getTime(),
                signAt: new Date().getTime(),
                color: color[num]
              };
              _context.next = 4;
              return store.collection('users').doc(user.uid).set(data);

            case 4:
              return _context.abrupt("return", _context.sent);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function createUser(_x) {
      return _ref.apply(this, arguments);
    }

    return createUser;
  }(),

  signUser: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
      var data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              data = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                signAt: new Date().getTime()

              };
              _context2.next = 3;
              return store.collection("users").doc(user.uid).update(data);

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    function signUser(_x2) {
      return _ref2.apply(this, arguments);
    }

    return signUser;
  }(),

  readUser: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(uid) {
      var refUser, doc;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              refUser = store.collection("users").doc(uid);
              _context3.next = 3;
              return refUser.get();

            case 3:
              doc = _context3.sent;

              if (!doc.exists) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", doc.data());

            case 8:
              return _context3.abrupt("return", null);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }));

    function readUser(_x3) {
      return _ref3.apply(this, arguments);
    }

    return readUser;
  }(),

  sendMessage: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user, message, type, date) {
      var data;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              data = {
                color: user.color,
                type: type,
                uid: user.uid,
                displayName: user.displayName,
                message: message,
                date: date
              };
              _context4.next = 3;
              return store.collection("chat").doc("general").collection("message").doc(date).set(data);

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    function sendMessage(_x4, _x5, _x6, _x7) {
      return _ref4.apply(this, arguments);
    }

    return sendMessage;
  }(),

  uploadData: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, file, date) {
      var data;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = {
                uid: user.uid,
                name: user.name,
                size: file.size,
                type: file.type,
                lastModifiedDate: file.lastModifiedDate,
                uploadDate: date

              };
              _context5.next = 3;
              return store.collection("files").doc(date).set(data);

            case 3:
              return _context5.abrupt("return", _context5.sent);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    }));

    function uploadData(_x8, _x9, _x10) {
      return _ref5.apply(this, arguments);
    }

    return uploadData;
  }(),

  deleteMessage: function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    function deleteMessage() {
      return _ref6.apply(this, arguments);
    }

    return deleteMessage;
  }(),

  downloadFile: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user) {
      var url;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return storageRef.child(user.message + user.date).getDownloadURL();

            case 2:
              url = _context7.sent;

              window.open(url);

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    }));

    function downloadFile(_x11) {
      return _ref7.apply(this, arguments);
    }

    return downloadFile;
  }(),

  update: function update(channel) {
    store.collection("chat").doc(channel).collection("message").onSnapshot(function (snapshot) {
      var docChanges = snapshot.docChanges();
      docChanges.forEach(function (change) {
        if (change.type === "added") {
          FirebaseApi.updateData(change.doc.data());
        }
        if (change.type === "modified") {}
        if (change.type === "removed") {
          // console.log("Removed city: ", change.doc.data());
        }
      });
    });
  }

};

// store.collection("chat").doc("general").collection("message")
//   .onSnapshot(function (snapshot) {
//     console.log('snapshot', snapshot);
//     const docChanges = snapshot.docChanges();
//     docChanges.forEach(function (change) {
//       if (change.type === "added") {
//         console.log('add', change.doc.data());
//         // FirebaseApi.updateData(change.doc.data());
//       }
//       if (change.type === "modified") {
//       }
//       if (change.type === "removed") {
//         // console.log("Removed city: ", change.doc.data());
//       }
//     });
//   });


var FirebaseApi = new function () {
  var _this = this;

  var signIn = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return auth.signInWithPopup(provider);

            case 3:
              loginListener();
              _context9.next = 8;
              break;

            case 6:
              _context9.prev = 6;
              _context9.t0 = _context9["catch"](0);

            case 8:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this, [[0, 6]]);
    }));

    return function signIn() {
      return _ref9.apply(this, arguments);
    };
  }();

  var signOut = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              _context10.next = 3;
              return auth.signOut();

            case 3:
              if (!_.isNil(loginListener)) loginListener();
              _context10.next = 8;
              break;

            case 6:
              _context10.prev = 6;
              _context10.t0 = _context10["catch"](0);

            case 8:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this, [[0, 6]]);
    }));

    return function signOut() {
      return _ref10.apply(this, arguments);
    };
  }();

  var loginListener = null;
  var getChannelDataListener = null;
  var pageUpdateListener = null;
  var currentUser = null;
  var updateContentListener = null;

  function setOnUpdateContentListener(callback) {
    updateContentListener = callback;
  }

  function setOnPageUpdateListener(callback) {
    pageUpdateListener = callback;
  }

  function setOnChannelDataListener(callback) {
    getChannelDataListener = callback;
  }

  function setOnLoginListener(callback) {
    loginListener = callback;
  }

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function () {

    return firebase.auth().signInWithEmailAndPassword(email, password);
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  auth.onAuthStateChanged(function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(user) {
      var u;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!_.isNil(user)) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt("return");

            case 2:
              if (_.isNil(user)) {
                _context8.next = 21;
                break;
              }

              _context8.next = 5;
              return FirebaseDB.readUser(user.uid);

            case 5:
              u = _context8.sent;

              if (!_.isNil(u)) {
                _context8.next = 14;
                break;
              }

              _context8.next = 9;
              return FirebaseDB.createUser(user);

            case 9:
              _context8.next = 11;
              return FirebaseDB.readUser(user.uid);

            case 11:
              u = _context8.sent;
              _context8.next = 19;
              break;

            case 14:
              _context8.next = 16;
              return FirebaseDB.signUser(user);

            case 16:
              _context8.next = 18;
              return FirebaseDB.readUser(user.uid);

            case 18:
              u = _context8.sent;

            case 19:

              currentUser = u;
              if (!_.isNil(pageUpdateListener)) pageUpdateListener(currentUser);

            case 21:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, _this);
    }));

    return function (_x12) {
      return _ref8.apply(this, arguments);
    };
  }());

  function sendMessage(message, type) {
    var date = new Date().getTime().toString();
    FirebaseDB.sendMessage(currentUser, message, type, date);
  }

  function updateData(data) {
    updateContentListener(data);
  }

  function uploadFileData(files) {
    var _this2 = this;

    _.forEach(files, function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(file) {
        var date, metadata;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                date = new Date().getTime().toString();
                metadata = {
                  type: file.type,
                  name: file.name,
                  date: date
                };
                _context11.next = 4;
                return FirebaseDB.sendMessage(currentUser, file.name, "file", date);

              case 4:
                _context11.next = 6;
                return storageRef.child(file.name + date).put(file, metadata);

              case 6:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, _this2);
      }));

      return function (_x13) {
        return _ref11.apply(this, arguments);
      };
    }());
  }

  return {
    uploadFileData: uploadFileData,
    updateData: updateData,
    sendMessage: sendMessage,
    signIn: signIn,
    signOut: signOut,
    setOnLoginListener: setOnLoginListener,
    setOnChannelDataListener: setOnChannelDataListener,
    setOnPageUpdateListener: setOnPageUpdateListener,
    setOnUpdateContentListener: setOnUpdateContentListener
  };
}();