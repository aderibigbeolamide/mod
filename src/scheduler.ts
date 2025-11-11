import cron from 'node-cron';
import { logger } from './config/logger.js';
import RequestCallBatchService from './api/v1/services/request-call-batch.service.js';
import { dataSource } from './config/database.config.js';
import { PaymentEntity } from './api/v1/entities/payment.entity.js';
import PaymentService from './api/v1/services/payment.service.js';
import { PaymentStatuses } from './api/v1/enums/payment.statuses.enum.js';
import { LessThan } from 'typeorm';

class Scheduler {
  private requestCallBatchService: RequestCallBatchService;
  private paymentRepo = dataSource.getRepository(PaymentEntity);
  private paymentService = new PaymentService();

  constructor() {
    this.requestCallBatchService = new RequestCallBatchService();
  }

  private async expirePendingPayments() {
    const now = new Date();
    const expiredPayments = await this.paymentRepo.find({
      where: {
        status: PaymentStatuses.INITIALIZED,
        paymentExpiresAt: LessThan(now),
      },
      relations: ['unit', 'payer'],
    });

    for (const payment of expiredPayments) {
      payment.status = PaymentStatuses.EXPIRED;
      await this.paymentRepo.save(payment);

      // Unlock any locked units
      if (payment.unitId && payment.payer) {
        await this.paymentService['unlockUnit'](payment.unitId, payment.payer.id);
      }

      logger.info(`⏰ Payment ${payment.reference} expired automatically.`);
    }
  }

  public startScheduledTasks(): void {
    // Run every hour at the top of the hour
    cron.schedule('0 * * * *', async () => {
      logger.info('Running hourly scheduled tasks...');

      try {
        await this.requestCallBatchService.processBatchCallRequests();
        await this.expirePendingPayments();
      } catch (error) {
        logger.error('Error in scheduled tasks:');
        logger.error(error);
      }
    });

    logger.info('✅ Scheduler initialized: runs every hour');
  }

  public stopScheduledTasks(): void {
    logger.info('⚠️ Scheduled tasks will continue running until explicitly stopped.');
  }
}

export default Scheduler;
