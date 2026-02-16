// import admin from "./firebase.js";

// export const sendPushNotification = async ({
//   fcmToken,
//   title,
//   body,
//   data = {},
// }) => {
//   if (!fcmToken) {
//     console.log("❌ No FCM token provided");
//     return;
//   }

//   const message = {
//     token: fcmToken,

//     // ---------------- NOTIFICATION ----------------
//     // notification: {
//     //   title: title,
//     //   body: body,
//     // },

//     // ---------------- DATA ----------------
//     data: {
//       ...data,
//       click_action: "FLUTTER_NOTIFICATION_CLICK",
//     },

//     // ---------------- ANDROID (HIGH PRIORITY) ----------------
//     android: {
//       priority: "high",
//       notification: {
//         sound: "default",
//         channelId: "high_priority_channel", // MUST match Android channel
//         visibility: "public",
//         notificationPriority: "PRIORITY_HIGH",
//       },
//     },

//     // ---------------- iOS (APNS HIGH PRIORITY) ----------------
//     apns: {
//       headers: {
//         "apns-priority": "10",
//         "apns-push-type": "alert",
//       },
//       payload: {
//         aps: {
//           alert: {
//             title: title,
//             body: body,
//           },
//           sound: "default",
//           badge: 1,
//         },
//       },
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ FCM sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("❌ FCM error:", error);
//     throw error;
//   }
// };




import admin from "./firebase.js";

export const sendPushNotification = async ({
  fcmToken,
  callId,
  senderId,
  receiverId,
  callerId,
  callerName,
  callType,
  zegoData = null,
  callStatus = "RINGING",
  message = ""
}) => {
  console.log("══════════════════════════════════════════════════");
  console.log("🚀 STARTING PUSH NOTIFICATION PROCESS");
  console.log("══════════════════════════════════════════════════");
  
  // Step 1: Validate FCM Token
  console.log("📱 STEP 1: Validating FCM Token");
  console.log("🔹 Token received:", fcmToken ? fcmToken.substring(0, 20) + "..." : "NULL");
  
  if (!fcmToken || fcmToken.trim() === "" || fcmToken === "null" || fcmToken === "undefined") {
    console.log("❌ ERROR: Invalid FCM token provided");
    console.log("══════════════════════════════════════════════════");
    return null;
  }
  
  if (fcmToken.length < 50) {
    console.log("❌ ERROR: Token too short, likely invalid");
    console.log("══════════════════════════════════════════════════");
    return null;
  }
  
  console.log("✅ Token validation passed");
  
  // Step 2: Determine Notification Type Based on callStatus
  console.log("\n🎯 STEP 2: Determining Notification Type");
  console.log("🔹 Call Status:", callStatus);
  
  let notificationTitle = "";
  let notificationBody = "";
  let notificationType = "incoming_call";
  
  // ✅ FIXED: Proper callStatus checks
  if (callStatus === "RINGING") {
    notificationTitle = `📞 ${callerName}`;
    notificationBody = callType === "audio" 
      ? "Incoming audio call - Tap to answer" 
      : "Incoming video call - Tap to answer";
    notificationType = "incoming_call";
    console.log("📱 Notification Type: Incoming Call (RINGING)");
  } 
  else if (callStatus === "MISSED" || callStatus === "MISSED_CALL_NOTIFICATION") {
    notificationTitle = `⏰ Missed Call`;
    notificationBody = `Missed call from ${callerName}`;
    notificationType = "missed_call";
    console.log("📱 Notification Type: Missed Call");
  }
  else if (callStatus === "REJECTED") {
    notificationTitle = `❌ Call Rejected`;
    notificationBody = `Your call to ${callerName} was not answered`;
    notificationType = "call_rejected";
    console.log("📱 Notification Type: Call Rejected");
  }
  else {
    notificationTitle = `📞 ${callerName}`;
    notificationBody = message || "Incoming call";
    notificationType = "incoming_call";
    console.log("📱 Notification Type: Default");
  }
  
  // Step 3: Prepare Notification Data
  console.log("\n📦 STEP 3: Preparing Notification Data");
  console.log("🔹 Call ID:", callId);
  console.log("🔹 Caller Name:", callerName);
  console.log("🔹 Call Type:", callType);
  console.log("🔹 Notification Title:", notificationTitle);
  console.log("🔹 Notification Body:", notificationBody);
  console.log("🔹 Notification Type:", notificationType);
  
  // Create data payload
  const notificationData = {
    type: notificationType,
    callId: String(callId),
    senderId: String(senderId),
    receiverId: String(receiverId),
    callerId: String(callerId),
    callerName: String(callerName),
    callType: String(callType),
    callStatus: String(callStatus),
    timestamp: Date.now().toString(),
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    sound: "call_sound",
    channelId: "incoming_calls_channel",
    priority: "high",
    vibration: "true",
  };
  
  // Add Zego data only for RINGING calls
  if (callStatus === "RINGING" && zegoData) {
    console.log("➕ Adding Zego data to payload (RINGING call)");
    notificationData.zegoRoomId = zegoData.roomId || "";
    notificationData.zegoToken = zegoData.token || "";
    notificationData.zegoAppId = zegoData.appId || "";
    notificationData.zegoUserId = zegoData.userId || "";
  } else {
    console.log("➖ Skipping Zego data (not a RINGING call)");
  }
  
  // Step 4: Create Complete Payload
  console.log("\n📝 STEP 4: Creating Complete FCM Payload");
  
  // ✅ FIXED: Create Android config based on callStatus
  const androidConfig = {
    priority: "high",
    ttl: callStatus === "RINGING" ? 60000 : 3600000,
    notification: {
      channelId: notificationType === "missed_call" ? "missed_calls_channel" : "incoming_calls_channel",
      sound: callStatus === "RINGING" ? "call_sound" : "default",
      defaultSound: true,
      visibility: "public",
      icon: "ic_notification",
      color: notificationType === "missed_call" ? "#FFA500" : "#FF0000",
    },
  };
  
  // ✅ FIXED: Add vibrate only, NO lightSettings when not RINGING
  if (callStatus === "RINGING") {
    androidConfig.notification.vibrateTimingsMillis = [0, 1000, 500, 1000, 500, 1000];
    androidConfig.notification.lightSettings = {
      color: "#FF0000FF",
      lightOnDurationMillis: 1000,
      lightOffDurationMillis: 500,
    };
  } else {
    androidConfig.notification.vibrateTimingsMillis = [0, 500];
    // ✅ NO lightSettings property for non-RINGING calls
  }
  
  // ✅ FIXED: Create APNS config
  const apnsConfig = {
    headers: {
      "apns-priority": callStatus === "RINGING" ? "10" : "5",
      "apns-push-type": "alert",
      "apns-topic": "com.yourcompany.app",
    },
    payload: {
      aps: {
        alert: {
          title: notificationTitle,
          body: notificationBody,
        },
        sound: callStatus === "RINGING" ? "call_sound.caf" : "default",
        badge: notificationType === "missed_call" ? 1 : 0,
        "content-available": 1,
        category: callStatus === "RINGING" ? "INCOMING_CALL" : "GENERAL",
        "mutable-content": 1,
        "thread-id": `call_${callId}`,
      },
    },
  };
  
  const payload = {
    token: fcmToken,
    data: notificationData,
    notification: {
      title: notificationTitle,
      body: notificationBody,
    },
    android: androidConfig,
    apns: apnsConfig,
    fcmOptions: {
      analyticsLabel: `${notificationType}_notification`,
    },
  };
  
  console.log("✅ Payload created successfully");
  console.log("📊 Payload Summary:");
  console.log("   Token:", fcmToken.substring(0, 10) + "...");
  console.log("   Channel:", androidConfig.notification.channelId);
  console.log("   Sound:", androidConfig.notification.sound);
  console.log("   Priority:", androidConfig.priority);
  console.log("   Has lightSettings:", callStatus === "RINGING" ? "YES" : "NO");
  console.log("   Timestamp:", new Date().toISOString());
  
  console.log("\n📤 STEP 5: Sending to Firebase Cloud Messaging");
  
  try {
    console.log("🔄 Calling admin.messaging().send()...");
    
    const startTime = Date.now();
    const response = await admin.messaging().send(payload);
    const endTime = Date.now();
    
    console.log("══════════════════════════════════════════════════");
    console.log("✅ PUSH NOTIFICATION SENT SUCCESSFULLY!");
    console.log("══════════════════════════════════════════════════");
    console.log("📨 NOTIFICATION DETAILS:");
    console.log("   Title:", notificationTitle);
    console.log("   Body:", notificationBody);
    console.log("   Type:", notificationType);
    console.log("   Status:", callStatus);
    console.log("   FCM Message ID:", response);
    console.log("   Response Time:", (endTime - startTime) + "ms");
    console.log("══════════════════════════════════════════════════");
    
    return response;
    
  } catch (error) {
    console.log("══════════════════════════════════════════════════");
    console.log("❌ FCM ERROR OCCURRED!");
    console.log("══════════════════════════════════════════════════");
    
    console.error("🔴 Error Code:", error.code);
    console.error("🔴 Error Message:", error.message);
    
    // ✅ FIXED: Better error logging
    if (error.code === 'messaging/invalid-payload') {
      console.error("🔴 Payload Issue: Check android.notification.lightSettings");
      console.error("🔴 Current lightSettings:", callStatus === "RINGING" ? "PRESENT" : "ABSENT");
    }
    
    if (error.errorInfo) {
      console.error("🔴 Error Details:");
      console.error("   Code:", error.errorInfo.code);
      console.error("   Message:", error.errorInfo.message);
    }
    
    // Handle specific errors
    if (error.code === 'messaging/registration-token-not-registered') {
      console.log("⚠️ ACTION REQUIRED: Token not registered - Remove from database");
    }
    
    console.log("══════════════════════════════════════════════════");
    
    return { 
      error: true, 
      code: error.code, 
      message: error.message,
      details: error.errorInfo 
    };
  }
};