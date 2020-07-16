const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_url: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});


function send(options) {
  let condition = `'${options.platform}_${options.stat}' in topics`;

  let message = {
    notification: {
      title: options.title,
      body: options.body,
    },
    android: {
      notification: {
        title: options.title,
        body: options.body,
        visibility: 'PUBLIC' // show notification on lock screen
      }
    },
    condition: condition
  };

  console.log('Sending FCM: ');
  console.log(message);

  return new Promise((resolve, reject) => {
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      resolve(response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      reject(error);
    });
  });
}

module.exports = {
  send
}