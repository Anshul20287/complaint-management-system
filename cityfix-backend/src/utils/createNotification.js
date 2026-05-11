import Notification from "../models/Notification.js";

const createNotification = async (data) => {
  console.log("DATA RECEIVED IN createNotification:", data);

  if (!data.user || !data.message || !data.type || !data.title) {
    throw new Error(
      `Invalid notification data: user=${data.user}, title=${data.title}, message=${data.message}, type=${data.type}`
    );
  }

  return await Notification.create({
    user: data.user,
    complaint: data.complaint,
    title: data.title,
    message: data.message,
    type: data.type,
    meta: data.meta || {}
  });
};

export default createNotification;