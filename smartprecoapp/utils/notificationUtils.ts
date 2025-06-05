// import * as Notifications from 'expo-notifications';

// /**
//  * Schedule a local test notification to simulate a push notification
//  * @param title The notification title
//  * @param body The notification body
//  * @param data Additional data to include in the notification (for deep linking)
//  * @param seconds Seconds to wait before showing the notification
//  */
// export async function scheduleLocalNotification(
//   title: string,
//   body: string,
//   data: Record<string, any> = {},
//   seconds: number = 5
// ) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title,
//       body,
//       data,
//     },
//     trigger: {
//       seconds,
//       type: 'timeInterval',
//     },
//   });
//   console.log(`Notification scheduled: "${title}" will appear in ${seconds} seconds`);
// }

// /**
//  * Cancel all scheduled notifications
//  */
// export async function cancelAllNotifications() {
//   await Notifications.cancelAllScheduledNotificationsAsync();
//   console.log('All scheduled notifications canceled');
// }

// /**
//  * Get all scheduled notifications
//  */
// export async function getScheduledNotifications() {
//   const notifications = await Notifications.getAllScheduledNotificationsAsync();
//   return notifications;
// }

// /**
//  * Test product detail notification
//  * @param productId The product ID to navigate to
//  */
// export async function testProductDetailNotification(productId: string | number) {
//   await scheduleLocalNotification(
//     'Novo preço disponível!',
//     'Um produto que você acompanha teve seu preço atualizado.',
//     {
//       screen: 'product-details',
//       productId,
//     }
//   );
// }

// /**
//  * Test market detail notification
//  * @param marketId The market ID to navigate to
//  */
// export async function testMarketDetailNotification(marketId: string | number) {
//   await scheduleLocalNotification(
//     'Novo mercado adicionado!',
//     'Um novo mercado foi adicionado próximo a você.',
//     {
//       screen: 'market-details',
//       marketId,
//     }
//   );
// }
