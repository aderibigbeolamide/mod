import { Request, Response, NextFunction } from "express";
import { PaymentDto, verifyPaymentDto } from "../dtos/payment.dto.js";
import paymentService from "../services/payment.service.js";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import { EErrorCode } from "../enums/errors.enum.js";
import { StatusCodes } from "http-status-codes";
import { DonationEntity } from "../entities/donation.entity.js";
import { CreateAccountDto } from "../dtos/createAccount.dto.js";
import AccountService from "../services/accountDetails.service.js";
import paystackApi from "../services/paystack.service.js";

const PaymentController = {

  // Initialize a payment
  async makePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Step 1: Retrieve the registered email from `req.user` (assume populated by auth middleware)
      const registeredEmail = req.user?.email;
      const providedEmail = req.body.email;

      // Determine email to use: provided email or registered email
      let emailToUse = providedEmail || registeredEmail;

      // Prompt the user if no email is provided
      if (!providedEmail && registeredEmail) {
        res.status(200).json({
          message: "Do you want to proceed with your registered email?",
          registeredEmail,
          instruction: "If you don't want to use the registered email, provide a new email for payment.",
        });
      }

      // Step 2: Construct the PaymentDto with the chosen email
      const paymentDto = new PaymentDto({
        ...req.body,
        email: emailToUse,
      });

      // Step 3: Call the service with the finalized `paymentDto`
      const result = await new paymentService().makePayment(paymentDto, req);
      res.status(200).json(result);
    } catch (error) {
      logger.error("An error occurred in initiating payment", error);
      next(error);
    }
  },

  async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Step 1: Validate and parse the request body
      const verifyPayment = new verifyPaymentDto(req.body);

      if (!verifyPayment.reference) {
        res.status(400).json({
          status: "error",
          message: "Missing transaction reference",
        });
        return;
      }

      // Step 2: Verify the payment using your service
      const verifiedPayment = await new paymentService().verifyPayment(verifyPayment);

      // Step 3: Extract dynamic origin (where user started payment)
      let origin =
        verifiedPayment?.metadata?.origin || // from Paystack metadata
        req.headers.origin || // from frontend request
        process.env.WEB_APP_URL || // fallback to default frontend
        "https://letbud.com"; // ultimate fallback

      // Step 4: Validate origin against allowed list
      const allowedOrigins = [
        "https://letbud.com",
        "https://www.letbud.com",
        "https://beta.letbud.com",
        "https://www.beta.letbud.com",
        "https://dev.letbud.com",
        "https://www.dev.letbud.com",
      ];

      if (!allowedOrigins.includes(origin)) {
        console.warn(`Unrecognized origin "${origin}" — falling back to default.`);
        origin = "https://letbud.com";
      }

      // Step 5: Redirect user back to frontend for confirmation
      const redirectUrl = `${origin}/payment/success?reference=${verifyPayment.reference}`;

      console.log(`✅ Redirecting user to: ${redirectUrl}`);
      return res.redirect(302, redirectUrl);
    } catch (error) {
      logger.error("An error occurred while verifying the payment", error);
      next(error);
    }
  },

  // async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { transactionReference } = req.body;

  //     if (!transactionReference) {
  //       res.status(400).json({
  //         status: 'error',
  //         message: 'Missing transaction reference',
  //       });
  //       return;
  //     }

  //     // Call the service to verify the payment using Monnify
  //     const result = await new paymentService().verifyPayment(transactionReference);

  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Payment verified successfully',
  //       data: result,
  //     });
  //   } catch (error) {
  //     logger.error('An error occurred while verifying the payment', error);
  //     next(error);
  //   }
  // },



  // get Payer By Unit Id
  // async getPayerByUnitId(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { unitId } = req.params;

  //     const result = await new paymentService().getPayerByUnitId(unitId);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     logger.error("An error occurred in getting payer by unit id", error);
  //     next(error);
  //   }
  // },

  async createAccountDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createAccountDto = new CreateAccountDto(req.body);

      if (!createAccountDto.accountNumber) {
        res.status(400).json({
          status: "error",
          message: "Missing account number",
        });
      }

      const result = await new AccountService().saveAccount(createAccountDto);

      res.status(200).json({
        status: "success",
        message: "Account details created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("An error occurred in creating account details", error);
      next(error);
    }
  },

  async fetchAccountDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createAccountDto = new CreateAccountDto(req.body);

      if (!createAccountDto.accountNumber) {
        res.status(400).json({
          status: "error",
          message: "Missing account number",
        });
      }

      const result = await new AccountService().fetchAccountDetails(createAccountDto);

      res.status(200).json({
        status: "success",
        message: "Account details fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error("An error occurred in creating account details", error);
      next(error);
    }
  },

  // Get account by user id
  async getAccountByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || req.sender?.id;

      const result = await new AccountService().getAccountByUserId(userId);

      if (!result) {
        res.status(404).json({
          status: "error",
          message: "Account not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Account details fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error("An error occurred in getting account by user id", error);
      next(error);
    }
  },

  // Cancel payment
  async cancelPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId, payerId } = req.body;

      if (!unitId || !payerId) {
        res.status(400).json({
          status: "error",
          message: "Unit ID and Payer ID are required",
        });
        return;
      }

      const result = await new paymentService().cancelPayment(unitId, payerId);
      res.status(200).json({
        status: "success",
        message: "Payment cancelled, unit unlocked.",
        data: result
      });
    } catch (error) {
      logger.error("An error occurred in cancelling payment", error);
      next(error);
    }
  },

  // Refund payment
  async refundPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { transactionId } = req.params;

      const result = await new paymentService().refundPayment(transactionId);
      res.status(200).json(result);
    } catch (error) {
      logger.error("An error occurred in processing refund");
      logger.error(error);
      next(error);
    }
  },

  // Check unit availability for payment
  async checkUnitAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params;

      if (!unitId) {
        res.status(400).json({
          status: "error",
          message: "Unit ID is required",
        });
        return;
      }

      const paymentServiceInstance = new paymentService();

      // Cleanup expired locks first
      await paymentServiceInstance.cleanupExpiredLocks();

      // Check actual unit availability
      const availability = await paymentServiceInstance.checkUnitAvailability(unitId);

      res.status(200).json({
        status: "success",
        message: "Unit availability checked successfully",
        data: {
          unitId: unitId,
          available: availability.available,
          message: availability.message,
          recommendation: availability.available ?
            "Unit is available. You can proceed with payment." :
            "Unit is not available. Please try again later or choose a different unit."
        }
      });
    } catch (error) {
      logger.error("An error occurred while checking unit availability", error);
      next(error);
    }
  },

  // Cleanup expired locks
  async cleanupExpiredLocks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentServiceInstance = new paymentService();
      await paymentServiceInstance.cleanupExpiredLocks();

      res.status(200).json({
        status: "success",
        message: "Expired locks cleaned up successfully"
      });
    } catch (error) {
      logger.error("An error occurred while cleaning up expired locks", error);
      next(error);
    }
  }

}

export default PaymentController;
function next(error: any) {
  throw new Error("Function not implemented.");
}

