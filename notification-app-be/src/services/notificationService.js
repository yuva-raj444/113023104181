let notifications = [];

const createNotification = (data) => {
  const notification = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date()
  };

  notifications.push(notification);

  return notification;
};

const getNotifications = () => {
  return notifications.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

module.exports = {
  createNotification,
  getNotifications
};