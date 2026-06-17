const axios = require('axios');

const REGISTER_URL = 'http://4.224.186.213/evaluation-service/register';
const AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';
const LOG_API_URL = 'http://4.224.186.213/evaluation-service/logs';

const allowedStacks = new Set(['backend', 'frontend']);
const allowedLevels = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const allowedPackages = new Set([
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository',
  'route', 'service', 'auth', 'config', 'middleware', 'utils'
]);

let clientCredentials = process.env.CLIENT_ID && process.env.CLIENT_SECRET 
  ? { clientID: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET }
  : null;

function normalizeStack(stack) {
  return allowedStacks.has(stack) ? stack : 'backend';
}

function normalizeLevel(level) {
  return allowedLevels.has(level) ? level : 'info';
}

function normalizePackage(pkg) {
  return allowedPackages.has(pkg) ? pkg : 'utils';
}

async function register() {
  try {
    const payload = {
      email: process.env.EVAL_EMAIL,
      name: process.env.EVAL_NAME,
      mobileNo: process.env.EVAL_MOBILE_NO,
      githubUsername: process.env.EVAL_GITHUB_USERNAME,
      rollNo: process.env.EVAL_ROLL_NO,
      accessCode: process.env.EVAL_ACCESS_CODE
    };

    const response = await axios.post(REGISTER_URL, payload, { timeout: 10000 });
    clientCredentials = {
      clientID: response.data.clientID,
      clientSecret: response.data.clientSecret
    };
    console.log('[REGISTERED] Got clientID and clientSecret');
    return true;
  } catch (error) {
    console.error('[REGISTER ERROR]', error.response?.data || error.message);
    return false;
  }
}

async function authenticate() {
  try {
    if (!clientCredentials) {
      const registered = await register();
      if (!registered) return false;
    }

    const payload = {
      email: process.env.EVAL_EMAIL,
      name: process.env.EVAL_NAME,
      rollNo: process.env.EVAL_ROLL_NO,
      accessCode: process.env.EVAL_ACCESS_CODE,
      clientID: clientCredentials.clientID,
      clientSecret: clientCredentials.clientSecret
    };

    const response = await axios.post(AUTH_URL, payload, { timeout: 10000 });
    return response.data.access_token;
  } catch (error) {
    console.error('[AUTH ERROR]', error.response?.data || error.message);
    return null;
  }
}

async function Log(stack, level, packageName, message) {
  const payload = {
    stack: normalizeStack(stack),
    level: normalizeLevel(level),
    package: normalizePackage(packageName),
    message: String(message ?? '')
  };

  try {
    const token = await authenticate();

    if (!token) {
      return { success: false, error: 'Unable to authenticate', payload };
    }

    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.post(LOG_API_URL, payload, { headers, timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('[LOG ERROR]', error.message);
    return { success: false, error: error.message, payload };
  }
}

module.exports = { Log };
