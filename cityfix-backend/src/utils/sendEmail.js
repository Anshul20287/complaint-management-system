const Notification = require('../models/Notification.model');
const { getIO }    = require('../config/socket');

/**
 * Create a notification and emit it via Socket.IO
 */
const createNotification = async ({ recipient, type, title, message, issue, data }) => {
  try {
    const notif = await Notification.create({ recipient, type, title, message, issue, data });

    // Emit real-time notification to the recipient's socket room
    try {
      const io = getIO();
      io.to(`user:${recipient}`).emit('notification:new', notif);
    } catch (_) {
      // Socket not ready – that's OK, notification is persisted
    }

    return notif;
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

/**
 * Notify all admins of a new event
 */
const notifyAdmins = async (type, title, message, issue) => {
  try {
    const io = getIO();
    io.to('admin').emit('notification:admin', { type, title, message, issue });
  } catch (_) {}
};

module.exports = { createNotification, notifyAdmins };
