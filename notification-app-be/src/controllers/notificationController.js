const notificationService = require("../services/notificationService");
const Log = require("../middleware/logger");

const createNotification = async (req, res) => {
  try {
    const { sender, recipient, message, priority } = req.body;

    const notification =
      notificationService.createNotification({
        sender,
        recipient,
        message,
        priority
      });

    await Log("backend","info","controller","Notification created successfully");

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    await Log("backend","error","controller",error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications =
      notificationService.getNotifications();

    await Log("backend","info","controller","Notifications fetched successfully");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    await Log("backend","error","controller",error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNotification,
  getNotifications
};