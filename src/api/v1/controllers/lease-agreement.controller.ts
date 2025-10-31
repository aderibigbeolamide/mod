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

      const pdfBuffer = await leaseAgreementService.generateLeaseAgreement(
        requestToRentId
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="lease-agreement.pdf"`
      );
      
      res.send(pdfBuffer);
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

  // DEPRECATED: Signing now handled via PropertyService.signLeaseAgreement
  // Use POST /api/v1/property/signLeaseAgreement with { unitId } instead
  // signLeaseAgreement: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const { requestToRentId } = req.params;

  //     if (!requestToRentId) {
  //       Utility.sendResponse(res, {
  //         message: 'Request to rent ID is required',
  //         code: 400,
  //       });
  //       return;
  //     }

  //     const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() 
  //       || req.headers['x-real-ip']?.toString() 
  //       || req.socket.remoteAddress 
  //       || 'Unknown';

  //     logger.info(`Tenant signing lease agreement for request: ${requestToRentId} from IP: ${clientIp}`);

  //     const repo = (await import('../../../config/database.config.js')).dataSource.getRepository(
  //       (await import('../entities/request-to-rent.entity.js')).RequestToRentEntity
  //     );

  //     const requestToRent = await repo.findOne({
  //       where: { id: requestToRentId },
  //     });

  //     if (!requestToRent) {
  //       Utility.sendResponse(res, {
  //         message: 'Request to rent not found',
  //         code: 404,
  //       });
  //       return;
  //     }

  //     if (requestToRent.userId !== req.sender.id) {
  //       Utility.sendResponse(res, {
  //         message: 'You do not have permission to sign this lease agreement',
  //         code: 403,
  //       });
  //       return;
  //     }

  //     if (!requestToRent.isApprove) {
  //       Utility.sendResponse(res, {
  //         message: 'Cannot sign lease agreement. Application has not been approved by landlord yet.',
  //         code: 403,
  //       });
  //       return;
  //     }

  //     if (requestToRent.leaseAgreementSigned) {
  //       Utility.sendResponse(res, {
  //         message: 'Lease agreement has already been signed',
  //         code: 400,
  //       });
  //       return;
  //     }

  //     const result = await leaseAgreementService.generateFinalSignedLeaseAgreement(
  //       requestToRentId
  //     );

  //     const signedAt = new Date();
  //     await repo.update(
  //       { id: requestToRentId },
  //       {
  //         leaseAgreementSigned: true,
  //         leaseAgreementSignedAt: signedAt,
  //         tenantSignedByIp: clientIp,
  //       } as any
  //     );

  //     Utility.sendResponse(res, {
  //       message: 'Lease agreement signed successfully',
  //       code: 200,
  //       data: {
  //         leaseAgreementUrl: result.s3Url,
  //         signedAt: signedAt.toISOString(),
  //         signedFromIp: clientIp,
  //       },
  //     });
  //   } catch (error: any) {
  //     logger.error('Error signing lease agreement:', error);
  //     next(error);
  //   }
  // },
};

export default LeaseAgreementController;
