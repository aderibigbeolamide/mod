import { Repository } from "typeorm";
import { PaymentTransactionEntity } from "../entities/paymentTransaction.entity.js";
import { PaymentTransactionDto } from "../dtos/paymentTransaction.dto.js";
import { PaymentTransactionStatus } from "../enums/paymentTransaction.status.enum.js";
import { dataSource } from "../../../config/database.config.js";
import { PaymentEntity } from "../entities/payment.entity.js";
import { BadRequestError } from "../../../utils/ApiError.js";
import { PaymentStatuses } from "../enums/payment.statuses.enum.js";
import { RequestToRentEntity } from "../entities/request-to-rent.entity.js";

class PaymentTransactionService {
  paymentRepo = dataSource.getRepository(PaymentEntity);
  transactionRepo = dataSource.getRepository(PaymentTransactionEntity);
  requestToRentRepo = dataSource.getRepository(RequestToRentEntity)

  // 1. Method to create a new transaction
  public async createPaymentTransaction(paymentId: string, requestToRentId: string): Promise<PaymentTransactionEntity> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['payer', 'payee'],
    });

    const requestToRent = await this.requestToRentRepo.findOne({ where: { id: requestToRentId } });

    if (!payment) {
      throw new BadRequestError(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status !== PaymentStatuses.CONFIRMED) {
      throw new BadRequestError('Payment is not in a confirmed state');
    }

    if (!requestToRent) {
      throw new BadRequestError(`Payment with ID ${requestToRent} not found`);
    }

    const transaction = this.transactionRepo.create({
      amount: payment.amount,
      status: PaymentTransactionStatus.PENDING,
      reference: payment.reference,
      payment: payment,
      requestToRent: requestToRent
    });

    const savedTransaction = await this.transactionRepo.save(transaction);

    console.log("Payment transaction created with reference:", savedTransaction.reference);

    return savedTransaction;
  }

  // 2. Method to update transaction status
  public async updateTransactionStatus(id: string, status: PaymentTransactionStatus): Promise<void> {
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) throw new Error("Transaction not found");

    transaction.status = status;
    await this.transactionRepo.save(transaction);
  }

  // 3. Method to retrieve a transaction by ID
  public async getTransactionById(id: string): Promise<PaymentTransactionEntity | null> {
    return await this.transactionRepo.findOneBy({ id });
  }


  // 5. Method to retrieve all pending transactions
  public async getAllPendingTransactions(): Promise<PaymentTransactionEntity[]> {
    return await this.transactionRepo.find({
      where: { status: PaymentTransactionStatus.PENDING },
      relations: ['payment'], // Include related payment entity if needed
    });
  }

  // 6. Method to retrieve all confirmed transactions
  public async getAllConfirmedTransactions(): Promise<PaymentTransactionEntity[]> {
    return await this.transactionRepo.find({
      where: { status: PaymentTransactionStatus.CONFIRMED },
      relations: ['payment'], // Include related payment entity if needed
    });
  }
  public async getAllFailedTransactions(): Promise<PaymentTransactionEntity[]> {
    return await this.transactionRepo.find({
      where: { status: PaymentTransactionStatus.FAILED },
      relations: ['payment'], // Include related payment entity if needed
    });
  }

  // method to retrieve all transactions
  public async getAllTransactions(): Promise<PaymentTransactionEntity[]> {
    return await this.transactionRepo.find({
      relations: ['payment'], // Include related payment entity if needed
    });
  }
}

export default PaymentTransactionService;
