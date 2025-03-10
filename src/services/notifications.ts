
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';

class NotificationService {
  async initialize() {
    try {
      const permissionStatus = await PushNotifications.checkPermissions();
      
      if (permissionStatus.receive === 'prompt') {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== 'granted') {
          console.log('User denied push notification permissions');
          return;
        }
      }

      await PushNotifications.register();
      
      // Add listeners for push notifications
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success:', token.value);
        // Here you would typically send this token to your backend
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        toast.info(notification.title, {
          description: notification.body,
        });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();
