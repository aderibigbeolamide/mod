import cron from 'node-cron';
import { logger } from './config/logger.js';
import RequestCallBatchService from './api/v1/services/request-call-batch.service.js';

class Scheduler {
  private requestCallBatchService: RequestCallBatchService;

  constructor() {
    this.requestCallBatchService = new RequestCallBatchService();
  }

  public startScheduledTasks(): void {
    // Run every hour at the top of the hour (0 0 * * * *)
    cron.schedule('0 * * * *', async () => {
      logger.info('Running hourly request call batch processing...');
      try {
        await this.requestCallBatchService.processBatchCallRequests();
      } catch (error) {
        logger.error('Error in scheduled request call batch processing:');
        logger.error(error);
      }
    });

    logger.info('Request call batch processing scheduled to run every hour');
  }

  public stopScheduledTasks(): void {
    // Note: Individual tasks would need to be stored to stop them
    logger.info('Scheduled tasks management - tasks continue running');
  }
}

export default Scheduler;