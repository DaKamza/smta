
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

class NotificationService {
  private deviceToken: string | null = null;

  async initialize() {
    try {
      // Check if push notifications are supported
      const permissionStatus = await PushNotifications.checkPermissions();
      
      if (permissionStatus.receive === 'prompt') {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive !== 'granted') {
          console.log('User denied push notification permissions');
          return;
        }
      } else if (permissionStatus.receive !== 'granted') {
        console.log('Push notification permissions not granted');
        return;
      }

      await PushNotifications.register();
      
      // Add listeners for push notifications
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success:', token.value);
        this.deviceToken = token.value;
        // Store token in localStorage for persistence
        localStorage.setItem('deviceToken', token.value);
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
        // Handle notification click/action here
      });

      // Retrieve saved token if available
      const savedToken = localStorage.getItem('deviceToken');
      if (savedToken) {
        this.deviceToken = savedToken;
      }

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  getDeviceToken() {
    return this.deviceToken;
  }

  async checkForDueTasks() {
    try {
      if (!this.deviceToken) {
        console.log('No device token available, skipping due task check');
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: { deviceToken: this.deviceToken }
      });

      if (error) {
        console.error('Error checking for due tasks:', error);
        return;
      }

      console.log('Due tasks check result:', data);
      return data;
    } catch (error) {
      console.error('Error checking for due tasks:', error);
    }
  }
}

export const notificationService = new NotificationService();
