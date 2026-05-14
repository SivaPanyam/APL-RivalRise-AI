const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "fanverse-ai-c706e"
  });
}

module.exports = { admin };
