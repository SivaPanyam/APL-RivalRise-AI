const admin = require('firebase-admin');

// Initialize Firebase Admin (mocked for local dev, replace with real credentials or default in Cloud Run)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });

module.exports = { admin };
