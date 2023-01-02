import { NotificationDto } from './dto/request/notification.dto';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FirebaseAdmin } from 'src/config/firebase';
import { PageDto } from 'src/dtos';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly logger: Logger) {
    if (!firebase.apps.length) {
      const firebaseCredentials: firebase.ServiceAccount = FirebaseAdmin;
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseCredentials),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }
  }

  private readonly options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  private readonly optionsSilent = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
    content_available: true,
  };

  // Common Service
  public async send(notificationDto: NotificationDto) {
    try {
      const { title, body, token } = notificationDto;
      const payload = {
        notification: {
          title,
          body,
        },
      };

      await firebase.messaging().sendToDevice(token, payload);
      console.log(`${this.send.name} executed with notification: ${title}`);
      return new PageDto('OK', HttpStatus.OK);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async sendToTopic(
    topic: 'all' | string,
    payload: firebase.messaging.MessagingPayload,
    silent: boolean,
  ) {
    if (!topic && topic.trim().length === 0) {
      throw new Error('You provide an empty topic name!');
    }

    let result = null;
    try {
      result = await firebase
        .messaging()
        .sendToTopic(
          topic,
          payload,
          silent ? this.optionsSilent : this.options,
        );
    } catch (error) {
      this.logger.error(
        error.message,
        error.stackTrace,
        'Firebase Cloud Messaging',
      );
      throw error;
    }
    return result;
  }

  async subscribeTopic(token: string, topic: string) {
    try {
      await firebase.messaging().subscribeToTopic([token], topic);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async unsubscribeTopic(token: string, topic: string) {
    try {
      await firebase.messaging().unsubscribeFromTopic([token], topic);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // Specific Service
  async sendJoinGroupNotification(groupName: string, token) {
    try {
      const title = 'Happy Meal';
      const body = `You've been added ${groupName} group`;
      const payload = {
        title,
        body,
        token,
      };
      await this.send(payload);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async sendRemoveMemberNotification(groupName: string, token) {
    try {
      const title = 'Happy Meal';
      const body = `You've been removed from ${groupName} group`;
      const payload = {
        title,
        body,
        token,
      };
      await this.send(payload);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
