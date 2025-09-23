import { Repository } from "typeorm";
import { PaymentEntity } from "../entities/payment.entity.js";
import { PaymentDto, verifyPaymentDto } from "../dtos/payment.dto.js";
import paystackApi, { PaystackApi } from "./paystack.service.js";
import { HttpException } from "../exceptions/http.exception.js";
import { STATUS_FAIL } from "../../../config/constants.js";
import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { PaymentTransactionStatus } from "../enums/paymentTransaction.status.enum.js";
import { dataSource } from "../../../config/database.config.js";
import { PaymentTransactionEntity } from "../entities/paymentTransaction.entity.js";
import { PaymentRates } from "../interfaces/paymentRate.interface.js";
import { Request, Response, NextFunction } from 'express';
import { Payment } from "../interfaces/payment.interface.js";
import paymentRateService from "./paymentRate.service.js";
import PaymentRateService from "./paymentRate.service.js";
import { UserEntity } from "../entities/user.entity.js";
import { error } from "console";
import { InitializePaymentResponse, PaystackAPIResponse, VerifyPaymentResponse } from "../interfaces/paystackAPIResponse.interface.js";
import { DonationEntity } from "../entities/donation.entity.js";
import { BadRequestError } from "../../../utils/ApiError.js";
import PaymentTransactionService from "./paymentTransaction.service.js";
import Utility from "../../../utils/utility.js";
import { PropertyEntity, PropertyUnitEntity } from "../entities/property.entity.js";
// import { MonnifyApi } from "./monnify.service.js";
import { instanceToPlain } from "class-transformer";

class PaymentService {

  paymentRepo = dataSource.getRepository(PaymentEntity);
  transactionRepo = dataSource.getRepository(PaymentTransactionEntity);
  unitRepo = dataSource.getRepository(PropertyUnitEntity);
  paystackApi = new PaystackApi();
  // monnifyApi = new MonnifyApi();
  paymentTransactionService = new PaymentTransactionService();
  paymentRateService = new PaymentRateService();

  // Payment lock timeout in minutes
  private readonly PAYMENT_LOCK_TIMEOUT = 15;

  /**
   * Check if a unit is available for payment (not locked, not occupied, not already paid)
   */
  public async checkUnitAvailability(unitId: string): Promise<{ available: boolean; message?: string }> {
    const unit = await this.unitRepo.findOne({ where: { id: unitId } });
    
    if (!unit) {
      return { available: false, message: "Unit not found" };
    }

    // Check if unit is occupied
    if (unit.isUnitOccupied) {
      return { available: false, message: "Unit is already occupied" };
    }

    // Check if unit is already paid for
    if (unit.isPaid && unit.paidUntil && new Date(unit.paidUntil) > new Date()) {
      return { available: false, message: "Unit is already paid for" };
    }

    // Check if unit is locked by another user
    if (unit.isLocked && unit.lockExpiresAt && new Date(unit.lockExpiresAt) > new Date()) {
      return { available: false, message: "Unit is currently being processed by another user. Please try again later." };
    }

    return { available: true };
  }

  /**
   * Lock a unit for payment processing
   */
  private async lockUnit(unitId: string, payerId: string): Promise<boolean> {
    const lockExpiresAt = new Date();
    lockExpiresAt.setMinutes(lockExpiresAt.getMinutes() + this.PAYMENT_LOCK_TIMEOUT);

    try {
      // Use optimistic locking to prevent race conditions
      // Include additional checks for unit availability in the lock condition
      const result = await this.unitRepo
        .createQueryBuilder()
        .update(PropertyUnitEntity)
        .set({
          isLocked: true,
          lockedBy: payerId,
          lockExpiresAt: lockExpiresAt
        })
        .where("id = :unitId", { unitId })
        .andWhere("(isLocked = false OR lockExpiresAt < :now)", { now: new Date() })
        .andWhere("(paidUntil IS NULL OR paidUntil <= :now)", { now: new Date() })
        .andWhere("isUnitOccupied = false")
        .execute();

      if (result.affected > 0) {
        // Re-validate the unit after locking to ensure it's still available
        const lockedUnit = await this.unitRepo.findOne({ where: { id: unitId } });
        if (!lockedUnit || 
            lockedUnit.isUnitOccupied || 
            (lockedUnit.paidUntil && new Date(lockedUnit.paidUntil) > new Date())) {
          // Unit became unavailable after lock, release it
          await this.unlockUnit(unitId, payerId);
          return false;
        }
      }

      return result.affected > 0;
    } catch (error) {
      console.error("Error locking unit:", error);
      return false;
    }
  }

  /**
   * Unlock a unit after payment completion or failure
   */
  private async unlockUnit(unitId: string, payerId?: string): Promise<void> {
    const updateConditions: any = { id: unitId };
    
    // If payerId is provided, only unlock if locked by this payer
    if (payerId) {
      updateConditions.lockedBy = payerId;
    }

    await this.unitRepo.update(updateConditions, {
      isLocked: false,
      lockedBy: null,
      lockExpiresAt: null
    });
  }

  /**
   * Mark a unit as paid after successful payment
   */
  private async markUnitAsPaid(unitId: string, paidUntil?: Date): Promise<void> {
    const updateData: any = {
      isPaid: true,
      isLocked: false,
      lockedBy: null,
      lockExpiresAt: null
    };

    if (paidUntil) {
      updateData.paidUntil = paidUntil;
    }

    await this.unitRepo.update({ id: unitId }, updateData);
  }

  /**
   * Cleanup expired locks
   */
  public async cleanupExpiredLocks(): Promise<void> {
    await this.unitRepo
      .createQueryBuilder()
      .update(PropertyUnitEntity)
      .set({
        isLocked: false,
        lockedBy: null,
        lockExpiresAt: null
      })
      .where("isLocked = true AND lockExpiresAt < :now", { now: new Date() })
      .execute();
  }

  // Initialize and create payment
  //   public async makePayment(paymentDto: PaymentDto): Promise<PaymentDto> {
  //     // Step 1: Verify the payer's existence
  //     const payer = await this.paymentRepo.manager.findOne(UserEntity, { where: { id: paymentDto.payer.id } });
  //     if (!payer) {
  //         throw new HttpException(
  //             404,
  //             "Payer not found",
  //             `No user found with ID: ${paymentDto.payer.id}`,
  //             "ERROR_CODE_USER_NOT_FOUND"
  //         );
  //     }

  //     console.log("Payer found:", payer);

  //     // Step 2: Construct the callback URL
  //     // const baseUrl = process.env.WEB_APP_URL || 'https://letbud.com'; // Default fallback
  //     // const callbackUrl = `${baseUrl}/payment/callback?reference=${encodeURIComponent(paymentDto.reference)}`;

  //     const baseUrl = 'https://letbud.com'; // Default fallback
  //     const callbackUrl = `${baseUrl}/payment/verify?reference=${encodeURIComponent(paymentDto.reference)}`;

  //     console.log("Constructed callback URL:", callbackUrl);

  //     // Step 3: Initialize payment with Paystack
  //     const paymentResponse: InitializePaymentResponse = await this.paystackApi.initializePayment({
  //         email: paymentDto.email,
  //         amount: paymentDto.amount,
  //         callback_url: callbackUrl, // Use the dynamically constructed URL
  //         metadata: {
  //             amount: paymentDto.amount,
  //             email: paymentDto.email,
  //             payerId: paymentDto.payer.id,
  //             payeeId: paymentDto.payee?.id || null,
  //         },
  //     });

  //     if (!paymentResponse || !paymentResponse.reference) {
  //         throw new HttpException(
  //             500,
  //             "Initialization error",
  //             "Failed to initialize payment with Paystack",
  //             "ERROR_CODE_PAYMENT_002"
  //         );
  //     }

  //     // Step 4: Create and save the payment record
  //     const payment = this.paymentRepo.create({
  //         amount: paymentDto.amount,
  //         status: PaymentStatuses.INITIALIZED,
  //         reference: paymentResponse.reference,
  //         accessCode: paymentResponse.accessCode,
  //         authorizationUrl: paymentResponse.authorizationUrl,
  //         email: paymentDto.email,
  //         channel: paymentDto.channel,
  //         payer: payer,
  //         payee: paymentDto.payee ? paymentDto.payee : null,
  //         payeeRole: paymentDto.payeeRole,
  //     });

  //     await this.paymentRepo.save(payment);
  //     console.log("Payment record created:", payment);

  //     // Step 5: Return response containing required fields
  //     return {
  //         reference: paymentResponse.reference,
  //         amount: paymentDto.amount,
  //         email: paymentDto.email,
  //         callbackUrl: callbackUrl, // Return the dynamically mapped callback URL
  //         accessCode: paymentResponse.accessCode,
  //         authorizationUrl: paymentResponse.authorizationUrl,
  //         channel: paymentDto.channel,
  //         payer: payer,
  //         payeeRole: paymentDto.payeeRole,
  //     };
  // }

  // public async makePayment(paymentDto: PaymentDto): Promise<PaymentDto> {
  //   // Step 1: Verify the payer's existence
  //   const payer = await this.paymentRepo.manager.findOne(UserEntity, { where: { id: paymentDto.payer.id } });
  //   if (!payer) {
  //     throw new HttpException(
  //       404,
  //       "Payer not found",
  //       `No user found with ID: ${paymentDto.payer.id}`,
  //       "ERROR_CODE_USER_NOT_FOUND"
  //     );
  //   }

  //   console.log("Payer found:", payer);

  //   // Step 2: Initialize payment with Paystack
  //   const paymentResponse: InitializePaymentResponse = await this.paystackApi.initializePayment({
  //     email: paymentDto.email,
  //     amount: paymentDto.amount,
  //     metadata: {
  //       amount: paymentDto.amount,
  //       email: paymentDto.email,
  //       payerId: paymentDto.payer.id,
  //       payeeId: paymentDto.payee?.id || null,
  //     },
  //   });

  //   if (!paymentResponse || !paymentResponse.reference) {
  //     throw new HttpException(
  //       500,
  //       "Initialization error",
  //       "Failed to initialize payment with Paystack",
  //       "ERROR_CODE_PAYMENT_002"
  //     );
  //   }

  //   // Step 3: Construct the callback URL with the reference from Paystack response
  //   // const baseUrl = process.env.WEB_APP_URL || 'https://letbud.com'; // Use environment variable or fallback
  //   // const callbackUrl = `${baseUrl}/payment/verify?reference=${encodeURIComponent(paymentResponse.reference)}`;
  //   const reference = paymentResponse.reference; // Extract from Paystack's response
  //   const callbackUrl = `${process.env.WEB_APP_URL}/payment/verify?reference=${reference}`;

  //   console.log("Constructed callback URL:", callbackUrl);

  //   // Step 4: Create and save the payment record
  //   const payment = this.paymentRepo.create({
  //     amount: paymentDto.amount,
  //     status: PaymentStatuses.INITIALIZED,
  //     reference: paymentResponse.reference,
  //     accessCode: paymentResponse.accessCode,
  //     authorizationUrl: paymentResponse.authorizationUrl,
  //     email: paymentDto.email,
  //     channel: paymentDto.channel,
  //     payer: payer,
  //     payee: paymentDto.payee ? paymentDto.payee : null,
  //     payeeRole: paymentDto.payeeRole,
  //   });

  //   await this.paymentRepo.save(payment);
  //   console.log("Payment record created:", payment);

  //   // Step 5: Return response containing required fields
  //   return {
  //     reference: paymentResponse.reference,
  //     amount: paymentDto.amount,
  //     email: paymentDto.email,
  //     callbackUrl: callbackUrl, // Return the dynamically mapped callback URL
  //     accessCode: paymentResponse.accessCode,
  //     authorizationUrl: paymentResponse.authorizationUrl,
  //     channel: paymentDto.channel,
  //     payer: payer,
  //     payeeRole: paymentDto.payeeRole,
  //   };
  // }

  public async makePayment(paymentDto: PaymentDto): Promise<PaymentDto> {
    // Step 1: Verify the payer's existence
    const payer = await this.paymentRepo.manager.findOne(UserEntity, { where: { id: paymentDto.payer.id } });
    if (!payer) {
      throw new HttpException(
        404,
        "Payer not found",
        `No user found with ID: ${paymentDto.payer.id}`,
        "ERROR_CODE_USER_NOT_FOUND"
      );
    }

    // Step 2: Validate the property and unit existence
    const property = paymentDto.propertyId
      ? await this.paymentRepo.manager.findOne(PropertyEntity, { where: { id: paymentDto.propertyId } })
      : null;

    const unit = paymentDto.unitId
      ? await this.paymentRepo.manager.findOne(PropertyUnitEntity, { where: { id: paymentDto.unitId } })
      : null;

    if (paymentDto.propertyId && !property) {
      throw new HttpException(404, "Property not found", `Property ID: ${paymentDto.propertyId} does not exist.`, "ERROR_CODE_PROPERTY_NOT_FOUND");
    }

    if (paymentDto.unitId && !unit) {
      throw new HttpException(404, "Unit not found", `Unit ID: ${paymentDto.unitId} does not exist.`, "ERROR_CODE_UNIT_NOT_FOUND");
    }

    // Step 2.5: Check unit availability and lock it if payment is for a specific unit
    if (paymentDto.unitId) {
      // Cleanup expired locks first
      await this.cleanupExpiredLocks();

      // Check unit availability
      const availability = await this.checkUnitAvailability(paymentDto.unitId);
      if (!availability.available) {
        throw new HttpException(
          409, // Conflict status code
          "Unit not available",
          availability.message,
          "ERROR_CODE_UNIT_NOT_AVAILABLE"
        );
      }

      // Attempt to lock the unit
      const lockSuccessful = await this.lockUnit(paymentDto.unitId, payer.id);
      if (!lockSuccessful) {
        throw new HttpException(
          409,
          "Unit not available",
          "Another user is currently processing payment for this unit. Please try again later.",
          "ERROR_CODE_UNIT_LOCKED"
        );
      }
    }

    let paymentResponse: InitializePaymentResponse;
    
    try {
      // Step 3: Initialize payment with Paystack
      paymentResponse = await this.paystackApi.initializePayment({
        email: paymentDto.email,
        amount: paymentDto.amount,
        metadata: {
          amount: paymentDto.amount,
          email: paymentDto.email,
          payerId: paymentDto.payer.id,
          payeeId: paymentDto.payee?.id || null,
          propertyId: paymentDto.propertyId,
          unitId: paymentDto.unitId,
        },
      });

      if (!paymentResponse || !paymentResponse.reference) {
        throw new HttpException(
          500,
          "Initialization error",
          "Failed to initialize payment with Paystack",
          "ERROR_CODE_PAYMENT_002"
        );
      }
    } catch (error) {
      // If payment initialization fails, unlock the unit
      if (paymentDto.unitId) {
        await this.unlockUnit(paymentDto.unitId, payer.id);
      }
      throw error;
    }

    // Construct the callback URL
    const reference = paymentResponse.reference;
    const callbackUrl = `${process.env.WEB_APP_URL}/payment/verify?reference=${reference}`;

    // Step 4: Create and save the payment record
    const payment = this.paymentRepo.create({
      amount: paymentDto.amount,
      status: PaymentStatuses.INITIALIZED,
      reference: paymentResponse.reference,
      accessCode: paymentResponse.accessCode,
      authorizationUrl: paymentResponse.authorizationUrl,
      email: paymentDto.email,
      channel: paymentDto.channel,
      payer: payer,
      payee: paymentDto.payee ? paymentDto.payee : null,
      payeeRole: paymentDto.payeeRole,
      property: property,
      propertyId: paymentDto.propertyId,
      unit: unit,
      unitId: paymentDto.unitId,
    });

    await this.paymentRepo.save(payment);

    // Step 5: Return response containing required fields
    return {
      reference: paymentResponse.reference,
      amount: paymentDto.amount,
      email: paymentDto.email,
      callbackUrl: callbackUrl,
      accessCode: paymentResponse.accessCode,
      authorizationUrl: paymentResponse.authorizationUrl,
      channel: paymentDto.channel,
      payer: payer,
      payeeRole: paymentDto.payeeRole,
      propertyId: paymentDto.propertyId,
      unitId: paymentDto.unitId,
    };
  }

  // async makePayment(paymentDto: PaymentDto): Promise<PaymentDto> {
  //   // 1. Verify the payer
  //   const payer = await this.paymentRepo.manager.findOne(UserEntity, { where: { id: paymentDto.payer.id } });
  //   if (!payer) {
  //     throw new HttpException(
  //       404,
  //       "Payer not found",
  //       `No user found with ID: ${paymentDto.payer.id}`,
  //       "ERROR_CODE_USER_NOT_FOUND"
  //     );
  //   }

  //   console.log("Payer found:", payer);

  //   // 2. Construct the callback URL
  //   const baseUrl = process.env.WEB_APP_URL || 'https://letbud.com';
  //   const reference = Utility.generateReference(); // assume you have a util to generate unique references
  //   const callbackUrl = `${baseUrl}/payment/verify?paymentReference=${reference}`;
  //   console.log("Constructed callback URL:", callbackUrl);

  //   // 3. Initialize payment with Monnify
  //   const monnifyResponse = await this.monnifyApi.initializePayment({
  //     amount: paymentDto.amount,
  //     customerEmail: paymentDto.email,
  //     paymentReference: reference,
  //     redirectUrl: callbackUrl,
  //     paymentDescription: "",
  //     contractCode: "",
  //     metadata: {
  //       email: paymentDto.email, // Replace with actual metadata fields
  //       amount: paymentDto.amount,
  //       payerId: paymentDto.payer.id,
  //       payeeId: paymentDto.payee?.id || null,
  //     }, // Define Monnify metadata object
  //     customerName: ""
  //   });

  //   if (!monnifyResponse || !monnifyResponse.paymentReference) {
  //     throw new HttpException(
  //       500,
  //       "Initialization error",
  //       "Failed to initialize payment with Monnify",
  //       "ERROR_CODE_MONNIFY_INIT"
  //     );
  //   }

  //   // 4. Save the payment
  //   const payment = this.paymentRepo.create({
  //     amount: paymentDto.amount,
  //     status: PaymentStatuses.INITIALIZED,
  //     paymentReference: monnifyResponse.paymentReference,
  //     authorizationUrl: monnifyResponse.checkoutUrl,
  //     email: paymentDto.email,
  //     channel: paymentDto.channel,
  //     payer: payer,
  //     payee: paymentDto.payee ?? null,
  //     payeeRole: paymentDto.payeeRole,
  //   });

  //   await this.paymentRepo.save(payment);
  //   console.log("Payment record saved:", payment);

  //   // 5. Return formatted response
  //   return instanceToPlain({
  //     reference: monnifyResponse.paymentReference,
  //     amount: paymentDto.amount,
  //     email: paymentDto.email,
  //     callbackUrl,
  //     authorizationUrl: monnifyResponse.checkoutUrl,
  //     accessCode: monnifyResponse.accessCode || '', // Include accessCode from Monnify response or provide a fallback
  //     channel: paymentDto.channel,
  //     payer: payer,
  //     payeeRole: paymentDto.payeeRole,
  //   }) as PaymentDto;
  // }




  public async verifyPayment(verifyPayment: verifyPaymentDto): Promise<verifyPaymentDto> {
    let payment: PaymentEntity | null = null;
    
    try {
      // Step 1: Retrieve payment entity by reference first
      payment = await this.paymentRepo.manager.findOne(PaymentEntity, {
        where: { reference: verifyPayment.reference },
        relations: ['payer', 'property', 'unit'], // Include payer, property, and unit in the query
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Step 2: Call Paystack API to verify payment
      const verifyResponse = await this.paystackApi.verifyPayment(verifyPayment.reference);

      if (!verifyResponse || verifyResponse.status !== 'success') {
        // Payment verification failed - unlock the unit if it was locked for this payment
        if (payment.unitId && payment.payer) {
          await this.unlockUnit(payment.unitId, payment.payer.id);
        }
        throw new Error('Payment verification failed');
      }

      // Step 3: Update payment status to 'CONFIRMED'
      payment.status = PaymentStatuses.CONFIRMED;
      await this.paymentRepo.save(payment);

      // Step 4: Handle unit lock release and mark as paid for successful payment
      if (payment.unitId && payment.payer) {
        // Calculate paid until date (assuming monthly payment)
        const paidUntil = new Date();
        paidUntil.setMonth(paidUntil.getMonth() + 1); // Add one month

        // Mark unit as paid and release lock
        await this.markUnitAsPaid(payment.unitId, paidUntil);
        
        console.log(`Unit ${payment.unitId} marked as paid until ${paidUntil.toISOString()} after successful payment verification`);
      }

      // Step 5: Return payment DTO with required fields
      return new verifyPaymentDto({
        reference: verifyPayment.reference,
        amount: verifyResponse.amount,
        email: payment.email, // Assuming email is from payment
        name: payment.payer?.username || '', // Username from payer or empty string
        payerId: payment.payer?.id || '', // Payer ID or empty string
        propertyId: payment.property?.id || '', // Property ID or empty string
        unitId: payment.unit?.id || '', // Unit ID or empty string
      });

    } catch (error) {
      // If any error occurs and we have payment info, unlock the unit
      if (payment && payment.unitId && payment.payer) {
        await this.unlockUnit(payment.unitId, payment.payer.id);
      }
      throw error;
    }
  }

  // public async verifyPayment(transactionReference: string): Promise<verifyPaymentDto> {
  //   // Step 1: Verify payment with Monnify using transactionReference
  //   const verifyResponse = await this.monnifyApi.verifyPayment(transactionReference);

  //   if (!verifyResponse || verifyResponse.paymentStatus !== 'PAID') {
  //     throw new Error('Payment verification failed or not completed.');
  //   }

  //   // Step 2: Find payment by the returned paymentReference from Monnify
  //   const payment = await this.paymentRepo.findOne({
  //     where: { paymentReference: verifyResponse.paymentReference },
  //     relations: ['payer', 'property', 'unit'],
  //   });

  //   if (!payment) {
  //     throw new Error('Payment record not found for the provided transaction.');
  //   }

  //   // Step 3: Update payment entity status if not already confirmed
  //   if (payment.status !== PaymentStatuses.CONFIRMED) {
  //     payment.status = PaymentStatuses.CONFIRMED;
  //     await this.paymentRepo.save(payment);
  //   }

  //   // Step 4: Return a populated verifyPaymentDto
  //   return new verifyPaymentDto({
  //     transactionReference: verifyResponse.transactionReference,
  //     paymentReference: verifyResponse.paymentReference,
  //     amount: verifyResponse.amountPaid,
  //     email: verifyResponse.customerEmail,
  //     name: verifyResponse.customerName,
  //     payerId: payment.payer?.id || '',
  //     propertyId: payment.property?.id || '',
  //     unitId: payment.unit?.id || '',
  //   });
  // }



  // public async getPayerByUnitId(unitId: string) {
  //   const payment = await this.paymentRepo.findOne({
  //     where: { 
  //       unit: { id: unitId },
  //       status: PaymentStatuses.CONFIRMED, // Only fetch confirmed payments
  //     },
  //     relations: ['payer', 'unit'], // Ensure payer and unit relationships are included
  //   });

  //   if (!payment) {
  //     throw new Error(`No confirmed payment found for unit ID ${unitId}`);
  //   }

  //   return payment.payer;
  // }



  // Refund payment
  // public async refundPayment(transactionId: string): Promise<{ status: string; message: string }> {
  //   try {
  //     const transaction = await this.transactionRepo.findOneBy({ id: transactionId });
  //     if (!transaction) throw new Error("Transaction not found");

  //     // If the user triggers a refund, no transfer is made to the property owner
  //     if (transaction.status === PaymentTransactionStatus.PENDING) {
  //       await this.monnifyApi.refundPayment({
  //         transactionReference: transaction.reference,
  //         amount: transaction.amount,
  //         reason: "Refund initiated by user"
  //       });
  //       transaction.status = PaymentTransactionStatus.REFUND;
  //       await this.transactionRepo.save(transaction);
  //     }

  //     return {
  //       status: "success",
  //       message: "Refund has been processed and is pending further verification."
  //     };
  //   } catch (error) {
  //     return {
  //       status: "error",
  //       message: "Failed to process refund."
  //     };
  //   }
  // }

  // Refund payment
  public async refundPayment(transactionId: string): Promise<{ status: string; message: string }> {
    try {
      const transaction = await this.transactionRepo.findOneBy({ id: transactionId });
      if (!transaction) throw new Error("Transaction not found");

      // If the user triggers a refund, no transfer is made to the property owner
      if (transaction.status === PaymentTransactionStatus.PENDING) {
        await this.paystackApi.refundPayment({
          transaction: transaction.reference,
          amount: transaction.amount,
        });
        transaction.status = PaymentTransactionStatus.REFUND;
        await this.transactionRepo.save(transaction);
      }

      return {
        status: "success",
        message: "Refund has been processed and is pending further verification."
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to process refund."
      };
    }
  }

  // Fetch BankNames and Bank codes
  // public async fetch(currency: string = "NG"): Promise<fetchBanks[]> {
  //   try {
  //     // Fetch banks using the fetchBanks method
  //     const banks = await paystackApi.fetchBanks({currency});

  //     // Map the response to only include name and code
  //     const bankDetails = banks.map((bank) => ({
  //       bankName: bank.bankName,
  //       bankCode: bank.bankCode,
  //       countryCode: bank.currencyCode || null, // Handle optional fields
  //       type: bank.type || null,           // Handle optional fields
  //     }));

  //     return bankDetails;
  //   } catch (error) {
  //     console.log("Fetching banks for country:", currency);
  //     console.error("Error fetching bank names and codes:", error.message || error);
  //     throw new Error("Failed to fetch bank names and codes. Please try again later.");
  //   }
  // }


  // GetAllFaild Payments
  public async getAllFailedPayments(): Promise<PaymentEntity[]> {
    const failed = this.paymentRepo.find({ where: { status: PaymentStatuses.FAILED } });
    if (!failed) throw new Error("Failed to retrieve failed payments");
    return failed;
  }
}


export default PaymentService;
