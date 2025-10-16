import { NextFunction, Request, Response } from 'express';
import { LeaseAgreementService } from '../services/lease-agreement.service.js';
import { logger } from '../../../config/logger.js';
import Utility from '../../../utils/utility.js';

const leaseAgreementService = new LeaseAgreementService();

const LeaseAgreementController = {
  generateLeaseAgreement: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentId } = req.params;

      if (!requestToRentId) {
        Utility.sendResponse(res, {
          message: 'Request to rent ID is required',
          code: 400,
        });
        return;
      }

      logger.info(`Generating lease agreement for request: ${requestToRentId}`);

      const result = await leaseAgreementService.generateAndSaveLeaseAgreement(
        requestToRentId
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`
      );
      
      res.send(result.pdfBuffer);
    } catch (error: any) {
      logger.error('Error generating lease agreement:', error);
      next(error);
    }
  },

  previewLeaseAgreement: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { requestToRentId } = req.params;

      if (!requestToRentId) {
        Utility.sendResponse(res, {
          message: 'Request to rent ID is required',
          code: 400,
        });
        return;
      }

      logger.info(`Generating lease agreement preview for request: ${requestToRentId}`);

      const pdfBuffer = await leaseAgreementService.generateLeaseAgreement(
        requestToRentId
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="lease-agreement-preview.pdf"`
      );
      
      res.send(pdfBuffer);
    } catch (error: any) {
      logger.error('Error generating lease agreement preview:', error);
      next(error);
    }
  },
};

export default LeaseAgreementController;
