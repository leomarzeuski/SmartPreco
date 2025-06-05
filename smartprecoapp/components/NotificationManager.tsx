import { useUser } from "@clerk/clerk-expo";
import * as Device from "expo-device";
import { router } from "expo-router";
import {
  useNotification,
  NotificationData,
} from "@/contexts/NotificationContext";

// import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// async function registerForPushNotificationsAsync() {
//   let token;
//   // if (Platform.OS === "android") {
//   //   await Notifications.setNotificationChannelAsync("default", {
//   //     name: "default",
//   //     importance: Notifications.AndroidImportance.MAX,
//   //     vibrationPattern: [0, 250, 250, 250],
//   //     lightColor: "#db36347b",
//   //   });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       return;
//     }

//     try {
//       const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
//       if (projectId) {
//         const pushToken = await Notifications.getExpoPushTokenAsync({
//           projectId: projectId,
//         });
//         token = pushToken.data;
//       } else {
//       }
//     } catch (error) {}
//   }
//   return token;
// }

export function NotificationsManager() {
  // const { user, isSignedIn } = useUser();
  // const [isLoading, setIsLoading] = useState(true);
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const { handleNotificationData } = useNotification();

  // const notificationListener = useRef<any | null>(null);
  // const responseListener = useRef<Notifications.Subscription | null>(null);

  // const handleNotificationResponse = (
  //   response: Notifications.NotificationResponse
  // ) => {
  //   const data = response.notification.request.content.data as NotificationData;

  //   handleNotificationData(data);

  //   if (data && data.screen) {
  //     switch (data.screen) {
  //       case "product-details":
  //         if (data.productId) {
  //           router.push({
  //             pathname: "/private/product-details",
  //             params: {
  //               id: data.productId,
  //             },
  //           });
  //         }
  //         break;
  //       case "market-details":
  //         if (data.marketId) {
  //           router.push({
  //             pathname: "/private/market-details",
  //             params: {
  //               id: data.marketId,
  //             },
  //           });
  //         }
  //         break;
  //       default:
  //         router.push("/private");
  //         break;
  //     }
  //   }
  // };

  // const saveTokenToClerk = async (token: string) => {
  //   try {
  //     if (user && isSignedIn) {
  //       const currentMetadata = user.unsafeMetadata || {};

  //       if (currentMetadata.pushToken === token) {
  //         return;
  //       }

  //       await user.update({
  //         unsafeMetadata: {
  //           ...currentMetadata,
  //           pushToken: token,
  //           platform: Platform.OS,
  //           lastTokenUpdate: new Date().toISOString(),
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Erro ao salvar token no Clerk:", error);
  //   }
  // };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   const getNotificationToken = async () => {
  //     const token = await registerForPushNotificationsAsync();
  //     if (token) {
  //       setExpoPushToken(token);
  //       if (isSignedIn && user) {
  //         await saveTokenToClerk(token);
  //       }
  //     }
  //   };

  //   getNotificationToken();

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       const data = notification.request.content.data as NotificationData;
  //       handleNotificationData(data);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener(
  //       handleNotificationResponse
  //     );

  //   return () => {
  //     if (notificationListener.current) {
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //     }
  //     if (responseListener.current) {
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     }
  //   };
  // }, [isSignedIn, user]);

  return null;
}
