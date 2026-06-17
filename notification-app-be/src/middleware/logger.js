const axios = require("axios");
require("dotenv").config();

const Log = async (stack, level, pkg, message) => {
  try {
    await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );
  } catch (err) {
    console.error("Logging Failed");
  }
};

module.exports = Log;