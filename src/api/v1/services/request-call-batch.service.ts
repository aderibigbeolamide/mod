import RequestCallService from "./request-call.service.js";
import CommService from "./comm.service.js";
import { RequestCall, RequestCallBatchSummary } from "../interfaces/request-call.interface.js";
import { logger } from "../../../config/logger.js";
import { v4 as uuidv4 } from 'uuid';

export default class RequestCallBatchService {
  private requestCallService: RequestCallService;
  private commService: CommService;

  constructor() {
    this.requestCallService = new RequestCallService();
    this.commService = new CommService();
  }

  public async processBatchCallRequests(): Promise<void> {
    try {
      logger.info("Starting batch processing of request call notifications");

      // Get all unprocessed requests
      const unprocessedRequests = await this.requestCallService.getUnprocessedRequests();

      if (unprocessedRequests.length === 0) {
        logger.info("No unprocessed request calls found");
        return;
      }

      const batchId = uuidv4();
      const batchSummary: RequestCallBatchSummary = {
        totalRequests: unprocessedRequests.length,
        requests: unprocessedRequests,
        batchId,
        processedAt: new Date()
      };

      // Send batch email to admin
      await this.sendBatchEmailToAdmin(batchSummary);

      // Mark requests as processed
      const requestIds = unprocessedRequests.map(req => req.id);
      await this.requestCallService.markRequestsAsProcessed(requestIds, batchId);

      logger.info(`Batch processing completed. Processed ${unprocessedRequests.length} request calls`);
    } catch (error) {
      logger.error("Error processing batch call requests:");
      logger.error(error);
    }
  }

  private async sendBatchEmailToAdmin(batchSummary: RequestCallBatchSummary): Promise<void> {
    try {
      const emailTemplate = this.buildBatchEmailTemplate(batchSummary);
      
      const nodemailer = (await import('nodemailer')).default;
      const transporter = nodemailer.createTransport(this.commService.conf);
      
      const mailOptions = {
        from: process.env.MAILER_USER,
        to: "admin@letbud.com",
        subject: `Letbud - Request Call Batch Summary (${batchSummary.totalRequests} new requests)`,
        html: emailTemplate
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Batch email sent to admin@letbud.com for batch ${batchSummary.batchId}`);
    } catch (error) {
      logger.error("Error sending batch email to admin:");
      logger.error(error);
      throw error;
    }
  }

  private buildBatchEmailTemplate(batchSummary: RequestCallBatchSummary): string {
    const requestsHtml = batchSummary.requests.map((request, index) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px; text-align: center;">${index + 1}</td>
        <td style="padding: 12px;">${request.email}</td>
        <td style="padding: 12px;">${request.phoneNumber}</td>
        <td style="padding: 12px;">${request.preferredCallTime || 'No preference'}</td>
        <td style="padding: 12px;">${new Date(request.createdAt).toLocaleString()}</td>
        <td style="padding: 12px;">
          ${request.isEmailOverridden || request.isPhoneOverridden ? 
            `<span style="color: #f39c12;">Modified</span>${request.overrideReason ? ` - ${request.overrideReason}` : ''}` : 
            '<span style="color: #27ae60;">User Data</span>'
          }
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            img { max-width: 100%; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; font-weight: bold; }
          </style>
        </head>
        <body style="margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 20px; background: #ffffff;">
          
          <div>
            <p style="width: 118px">
              <img src="https://firebasestorage.googleapis.com/v0/b/assets-40688.appspot.com/o/logo.png?alt=media&token=44a79d9b-d59a-49d3-8eaf-a9a5e7d1e9c1" alt="letbud logo" />
            </p>
          </div>

          <div style="background-color: #ebf0f9;">
            <main style="margin: 0 auto; background-color: #ebf0f9; padding: 20px;">
              
              <div style="text-align: center; padding: 32px 10px; margin-bottom: 20px; background: #fdf2d3; color: #1b3562; font-weight: 700; font-size: 24px; border-radius: 8px;">
                📞 Request Call Batch Summary
              </div>

              <div style="padding: 0 20px; color: #1E1E2D; background: white; border-radius: 8px; padding: 30px;">
                
                <h2 style="color: #1b3562; margin-top: 0;">New Call Requests</h2>
                
                <p style="font-size: 16px; line-height: 1.6;">
                  <strong>Batch ID:</strong> ${batchSummary.batchId}<br>
                  <strong>Total Requests:</strong> ${batchSummary.totalRequests}<br>
                  <strong>Processed At:</strong> ${batchSummary.processedAt.toLocaleString()}
                </p>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <thead>
                    <tr style="background-color: #1b3562; color: white;">
                      <th style="padding: 15px; text-align: center;">#</th>
                      <th style="padding: 15px;">Email</th>
                      <th style="padding: 15px;">Phone Number</th>
                      <th style="padding: 15px;">Preferred Time</th>
                      <th style="padding: 15px;">Requested At</th>
                      <th style="padding: 15px;">Contact Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${requestsHtml}
                  </tbody>
                </table>

                <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #1b3562;">
                  <h3 style="margin-top: 0; color: #1b3562;">Next Steps</h3>
                  <ul style="line-height: 1.8; color: #555;">
                    <li>Review each request and prepare for callback</li>
                    <li>Contact users at their preferred number during their specified preferred times</li>
                    <li>Note any modified contact information and preferred call times</li>
                    <li>Update CRM system with call outcomes and schedule follow-ups as needed</li>
                  </ul>
                </div>

              </div>

            </main>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
            <p>This is an automated message from Letbud Admin System</p>
            <p>Batch ID: ${batchSummary.batchId}</p>
          </div>

        </body>
      </html>
    `;
  }
}