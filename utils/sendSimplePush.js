// import admin from "./firebase.js";

// /**
//  * Sends a push notification via FCM using a single token
//  * @param {string} fcmToken - Device FCM token
//  * @param {string} title - Notification title
//  * @param {string} body - Notification body
//  * @param {Object} data - Optional data payload
//  */
// const sendSimplePush = async ({ fcmToken, title, body, data = {} }) => {
//   if (!fcmToken) return; // Token nahi hai, skip

//   const stringifiedData = Object.fromEntries(
//     Object.entries(data).map(([k, v]) => [k, v.toString()])
//   );

//   const message = {
//     token: fcmToken,
//     notification: { title, body },
//     data: stringifiedData,
//     android: { priority: "high" },
//     apns: { headers: { "apns-priority": "10" } },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("🔔 Push sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("❌ Push failed:", error);
//     // Error throw kar rahe hain, par DB update ya token removal nahi
//     throw error;
//   }
// };

// export default sendSimplePush;



import admin from "./firebase.js";

/**
 * Sends a push notification via FCM using a single token
 * @param {string} fcmToken - Device FCM token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Optional data payload
 */
const sendSimplePush = async ({ fcmToken, title, body, data = {} }) => {
  if (!fcmToken) return;

  // Ensure all data values are stringified
  const stringifiedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.toString()])
  );

  // Construct the notification message
  const message = {
    token: fcmToken,  // Target device token

    // Notification content for the user
    notification: {
      title,  // Title of the notification
      body,   // Body of the notification
    },

    // Optional data payload
    data: stringifiedData,

    // Android-specific settings
    android: {
      priority: "high",  // High priority for immediate delivery
      notification: {
        channelId: "high_importance_channel",  // The channel must exist in the app
        priority: "high",  // Ensures heads-up notifications on Android
        defaultSound: true,  // Play default sound
        defaultVibrateTimings: true,  // Default vibration pattern
      },
    },

    // APNs (Apple Push Notification service) settings for iOS
    apns: {
      headers: {
        "apns-priority": "10",  // Ensures immediate delivery on iOS (10 is high priority)
      },
    },
  };

  // Send the push notification
  try {
    const response = await admin.messaging().send(message);
    console.log("🔔 Push sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Push failed:", error);
    // Throw error to handle failures (e.g., retry or logging)
    throw error;
  }
};

export default sendSimplePush;

