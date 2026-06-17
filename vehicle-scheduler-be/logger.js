const { Log } = require('../logging-middleware');

async function safeLog(level, message) {
  await Log('backend', level, 'route', message);
}

module.exports = { safeLog };
