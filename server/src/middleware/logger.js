const morgan = require('morgan');

const logger = (app) => {
  // Use morgan for HTTP request logging
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  // Custom log function for internal events
  console.log('[System] Logging middleware initialized');
};

module.exports = logger;
