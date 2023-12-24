// Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);

const APP_BASE_URL = 'https://hungdevjs-warm.web.app';

const NotificationTypes = {
  CreateNewPost: 'create-new-post',
  NewPostComment: 'new-post-comment',
  CreateNewNote: 'create-new-note',
  CreateNewTodo: 'create-new-todo',
  NewMessage: 'new-message',
  UpdateCouple: 'update-couple',
};

const firebaseConfig = {
  apiKey: 'AIzaSyCU-NLhY3i6AHggNhhAYVI7s0Hj0ZdzKZI',
  authDomain: 'hungdevjs-warm.firebaseapp.com',
  projectId: 'hungdevjs-warm',
  storageBucket: 'hungdevjs-warm.appspot.com',
  messagingSenderId: '393939074200',
  appId: '1:393939074200:web:9639327659c7d83373e4ed',
  measurementId: 'G-65S74FZ139',
};

// // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { text, type, postId, todoId, noteId } = payload.data;

  let path;
  switch (type) {
    case NotificationTypes.CreateNewPost:
      path = `/home/posts/${postId}`;
      break;
    case NotificationTypes.CreateNewNote:
      path = `/home/posts/${noteId}`;
      break;
    case NotificationTypes.CreateNewTodo:
      path = `/home/posts/${todoId}`;
      break;
    case NotificationTypes.NewPostComment:
      path = `/home/posts/${postId}`;
      break;
    case NotificationTypes.NewMessage:
      path = `/chat`;
      break;
    default:
      break;
  }

  const notificationOptions = {
    body: text,
    data: { path },
  };

  self.registration.showNotification(
    'New notifications from Warm',
    notificationOptions
  );
});

self.addEventListener('notificationclick', function (event) {
  const { path } = event.notification.data;
  if (path) {
    clients.openWindow(APP_BASE_URL + path);
  }
});
