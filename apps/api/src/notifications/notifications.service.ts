import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification } from '../entities';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  listByUser(userId: string) {
    return this.notificationsRepository.find({
      where: [{ userId }, { userId: IsNull() }],
      order: { createdAt: 'DESC' },
    });
  }

  async createAndSend(dto: CreateNotificationDto) {
    const notification = await this.notificationsRepository.save(
      this.notificationsRepository.create({
        ...dto,
        userId: dto.userId ?? null,
        type: dto.type ?? 'general',
        status: 'sent',
        metadata: {
          ...(dto.metadata ?? {}),
          provider: 'fcm_stub',
          todo: 'TODO: Integrate Firebase Admin SDK to push real notifications.',
        },
      }),
    );

    return {
      notification,
      provider: 'fcm_stub',
      todo: 'Set FCM_SERVER_KEY / Firebase service account env vars for production.',
    };
  }
}
