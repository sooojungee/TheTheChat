var config = {
  apiKey: "AIzaSyDBv_zL-BHPtXOpFxTes0cv7BpYZ4PckeE",
  authDomain: "chat-1bdde.firebaseapp.com",
  databaseURL: "https://chat-1bdde.firebaseio.com",
  projectId: "chat-1bdde",
  storageBucket: "chat-1bdde.appspot.com",
  messagingSenderId: "188963284072"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const store = firebase.firestore();
const storage = firebase.storage();

const storageRef = storage.ref();
const settings = {timestampsInSnapshots: true};
store.settings(settings);

const color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

const FirebaseDB = {
  
  createUser: async (user) => {
    
    const num = Math.floor(Math.random() * color.length) + 1;
    
    const data = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().getTime(),
      signAt: new Date().getTime(),
      color: color[num]
    };
    
    return await store.collection('users').doc(user.uid).set(data);
  },
  
  signUser: async (user) => {
    const data = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      signAt: new Date().getTime(),
      
    };
    
    return await store.collection("users").doc(user.uid).update(data);
  },
  
  readUser: async (uid) => {
    const refUser = store.collection("users").doc(uid);
    const doc = await refUser.get();
    if (doc.exists) return doc.data();
    else return null;
  },
  
  sendMessage: async (user, message, type, date) => {
    const data = {
      color: user.color,
      type: type,
      uid: user.uid,
      displayName: user.displayName,
      message: message,
      date: date,
    };
    
    return await store.collection("chat").doc("general").collection("message").doc(date).set(data);
    
  },
  
  uploadData: async (user, file, date) => {
    
    const data = {
      uid: user.uid,
      name: user.name,
      size: file.size,
      type: file.type,
      lastModifiedDate: file.lastModifiedDate,
      uploadDate: date
      
    };
    
    return await store.collection("files").doc(date).set(data);
  },
  
  deleteMessage: async () => {
  
  },
  
  downloadFile: async (user) => {
    const url = await storageRef.child(user.message + user.date).getDownloadURL();
    window.open(url);
  },
  
  update: (channel) => {
    store.collection("chat").doc(channel).collection("message")
      .onSnapshot(function (snapshot) {
        const docChanges = snapshot.docChanges();
        docChanges.forEach(function (change) {
          if (change.type === "added") {
            FirebaseApi.updateData(change.doc.data());
          }
          if (change.type === "modified") {
          }
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


const FirebaseApi = new function () {
  
  let loginListener = null;
  let getChannelDataListener = null;
  let pageUpdateListener = null;
  let currentUser = null;
  let updateContentListener = null;
  
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
  
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
      
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  
  
  auth.onAuthStateChanged(async (user) => {
    if (_.isNil(user)) {
      return;
    }
    
    if (!_.isNil(user)) {
      let u = await FirebaseDB.readUser(user.uid);
      
      if (_.isNil(u)) {
        await FirebaseDB.createUser(user);
        u = await FirebaseDB.readUser(user.uid);
      }
      else {
        await FirebaseDB.signUser(user);
        u = await FirebaseDB.readUser(user.uid);
      }
      
      currentUser = u;
      if (!_.isNil(pageUpdateListener)) pageUpdateListener(currentUser);
    }
    
  });
  
  async function signIn() {
    try {
      await auth.signInWithPopup(provider);
      loginListener();
    }
    catch (e) {
    
    }
  }
  
  async function signOut() {
    try {
      await auth.signOut();
      if (!_.isNil(loginListener)) loginListener();
    }
    catch (e) {
    
    }
  }
  
  function sendMessage(message, type) {
    const date = new Date().getTime().toString();
    FirebaseDB.sendMessage(currentUser, message, type, date);
  }
  
  function updateData(data) {
    updateContentListener(data);
  }
  
  function uploadFileData(files) {
    
    _.forEach(files, async file => {
      
      const date = new Date().getTime().toString();
      
      const metadata = {
        type: file.type,
        name: file.name,
        date: date
      };
      await FirebaseDB.sendMessage(currentUser, file.name, "file", date);
      await storageRef.child(file.name + date).put(file, metadata);
      
    });
    
  }
  
  return {
    uploadFileData,
    updateData,
    sendMessage,
    signIn,
    signOut,
    setOnLoginListener,
    setOnChannelDataListener,
    setOnPageUpdateListener,
    setOnUpdateContentListener
  };
  
};