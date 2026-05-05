const serverless = require('serverless-http');
const app = require('../../server'); // The exported express app

// Wrap the express app for AWS Lambda (Netlify)
module.exports.handler = serverless(app);
