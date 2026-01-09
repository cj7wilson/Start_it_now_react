import { Notifications } from 'react-native-notifications';

class NotificationService {
  constructor() {
    Notifications.registerRemoteNotifications();
  }

  scheduleNotification = (fireDate: Date, title: string, body: string): string => {
    const notification = Notifications.postLocalNotification({
      title,
      body,
      fireDate: fireDate.toISOString(),
    });
    return notification.notificationId;
  };

  cancelNotification = (notificationId: string) => {
    Notifications.cancelLocalNotification(notificationId);
  };
}

export const notificationService = new NotificationService();
