import { PermissionsAndroid, Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { logService } from './logService';

class PermissionService {
  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'StartNow needs access to your microphone to record audio for tasks.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        logService.error('Failed to request microphone permission.', err);
        return false;
      }
    } else {
      return true;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
        return true
    } else {
      const { alert, badge, sound } = await Notifications.isRegisteredForRemoteNotifications();
      return alert || badge || sound;
    }
  }

  async checkMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }
    return true;
  }
}

export const permissionService = new PermissionService();