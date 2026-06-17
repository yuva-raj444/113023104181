# Logging Middleware

Reusable logger package with automatic registration and authentication flow.

## Features

- Auto-registers with credentials to get `clientID` and `clientSecret`
- Auto-authenticates to get bearer token
- Logs to `http://4.224.186.213/evaluation-service/logs`
- Validates stack, level, and package name
- Token caching to avoid repeated auth calls
- Fallback to console when credentials missing

## Setup

Set these environment variables:

```
EVAL_EMAIL=your_college_email
EVAL_NAME=Your Name
EVAL_MOBILE_NO=9876543210
EVAL_GITHUB_USERNAME=yourgithubusername
EVAL_ROLL_NO=yourrollno
EVAL_ACCESS_CODE=accesscode_from_email
```

## Usage

```javascript
const { Log } = require('./logging-middleware');

await Log('backend', 'info', 'route', 'vehicle created');
```

## Screenshots

- Register Response: [Placeholder]
- Auth Token Response: [Placeholder]
- Log API Response: [Placeholder]
