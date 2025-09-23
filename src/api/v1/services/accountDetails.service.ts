import { Repository } from "typeorm";
import axios from "axios";
import { AccountDetailsEntity } from "../entities/accountDetails.entity.js";
import { CreateAccountDto } from "../dtos/createAccount.dto.js";
import { PaystackApi } from "./paystack.service.js";
import { dataSource } from "../../../config/database.config.js";
import { UserEntity } from "../entities/user.entity.js";
import { HttpException } from "../exceptions/http.exception.js";
import { AccountDetails } from "../interfaces/paystackAPIResponse.interface.js";


export class AccountService {
    accountRepo = dataSource.getRepository(AccountDetailsEntity);
    paystackApi = new PaystackApi();

    // async createAccount(details: CreateAccountDto): Promise<any> {
    //     try {
    //         const existingAccount = await this.accountRepo.findOne({
    //             where: { userId: details.userId },
    //         });

    //         if (existingAccount) {
    //             throw new Error("Account already exists");
    //         }

    //         // Fetch account details from external service
    //         const accountDetails = await this.paystackApi.fetchAccountDetails(
    //             details.accountNumber,
    //             details.bankCode
    //         );

    //         if (!accountDetails) {
    //             throw new Error("Failed to fetch account details");
    //         }

    //         // Create the account entity
    //         const accountEntity = this.accountRepo.create({
    //             userId: details.userId,
    //             accountNumber: accountDetails.accountNumber,
    //             accountName: accountDetails.accountName,
    //             bankName: accountDetails.bankCode,
    //             // bankCode: details.bankCode,
    //         });

    //         await this.accountRepo.save(accountEntity);

    //         return {
    //             accountDetails,
    //         };
    //     } catch (error) {
    //         console.error("Error in createAccount:", error.message || error);
    //         throw error;
    //     }
    // }

    // Initialize and create payment
    // public async createAccount(createAccountDto: CreateAccountDto): Promise<AccountDetailsEntity> {
    //     try {
    //         // Step 1: Verify the payee's existence
    //         const payee = await this.accountRepo.manager.findOne(UserEntity, { where: { id: createAccountDto.payee.id } });
    //         if (!payee) {
    //             throw new HttpException(
    //                 404,
    //                 "Payer not found",
    //                 `No user found with ID: ${createAccountDto.payee.id}`,
    //                 "ERROR_CODE_USER_NOT_FOUND"
    //             );
    //         }

    //         console.log("Payer found:", payee);

    //         // Step 2: Fetch account details from Paystack
    //         const accountResponse = await this.paystackApi.fetchAccountDetails({
    //             accountNumber: createAccountDto.accountNumber,
    //             bankCode: createAccountDto.bankCode,
    //         });

    //         console.log("Fetched account details:", accountResponse);

    //         if (!accountResponse) {
    //             throw new HttpException(
    //                 500,
    //                 "Initialization error",
    //                 "Failed to fetch account details from Paystack",
    //                 "ERROR_CODE_PAYMENT_002"
    //             );
    //         }

    //         // Step 3: Create and save the account record
    //         const account = this.accountRepo.create({
    //             payee: payee,
    //             accountNumber: accountResponse.accountNumber,
    //             accountName: accountResponse.accountName,
    //             bankCode: createAccountDto.bankCode,
    //             bankId: accountResponse.bankId,
    //             bankName: createAccountDto.bankName,
    //         });

    //         await this.accountRepo.save(account);
    //         console.log("Account record created:", account);

    //         // Step 4: Return the created account
    //         return account;
    //     } catch (error) {
    //         console.error("Error in createAccount:", error.message || error);
    //         throw error;
    //     }
    // }

    public async fetchAccountDetails(createAccountDto: CreateAccountDto): Promise<AccountDetailsEntity> {
        try {
            // Step 1: Verify the payee's existence
            const payee = await this.accountRepo.manager.findOne(UserEntity, { where: { id: createAccountDto.payee.id } });

            if (!payee) {
                throw new HttpException(
                    404,
                    "Payer not found",
                    `No user found with ID: ${createAccountDto.payee.id}`,
                    "ERROR_CODE_USER_NOT_FOUND"
                );
            }

            console.log("Payer found:", payee);

            // Step 2: Fetch account details from Paystack
            const accountResponse = await this.paystackApi.fetchAccountDetails({
                accountNumber: createAccountDto.accountNumber,
                bankCode: createAccountDto.bankCode,
            });

            console.log("Fetched account details:", accountResponse);

            if (!accountResponse) {
                throw new HttpException(
                    500,
                    "Initialization error",
                    "Failed to fetch account details from Paystack",
                    "ERROR_CODE_PAYMENT_002"
                );
            }

            const fetchAccountDetails = this.accountRepo.create({
                payee: payee,
                accountNumber: accountResponse.accountNumber,
                accountName: accountResponse.accountName,
                bankCode: createAccountDto.bankCode,
                bankId: accountResponse.bankId,
                bankName: createAccountDto.bankName,
            });
            return fetchAccountDetails;

        } catch (error) {
            console.error("Error in createAccount:", error.message || error);
            throw error;
        }

    }

    public async saveAccount(createAccountDto: CreateAccountDto): Promise<AccountDetailsEntity> {
        try {
            // Step 1: Verify the payee's existence
            const payee = await this.accountRepo.manager.findOne(UserEntity, { where: { id: createAccountDto.payee.id } });

            if (!payee) {
                throw new HttpException(
                    404,
                    "Payer not found",
                    `No user found with ID: ${createAccountDto.payee.id}`,
                    "ERROR_CODE_USER_NOT_FOUND"
                );
            }

            console.log("Payer found:", payee);

            // Step 2: Fetch account details from Paystack
            const accountResponse = await this.paystackApi.fetchAccountDetails({
                accountNumber: createAccountDto.accountNumber,
                bankCode: createAccountDto.bankCode,
            });

            console.log("Fetched account details:", accountResponse);

            if (!accountResponse) {
                throw new HttpException(
                    500,
                    "Initialization error",
                    "Failed to fetch account details from Paystack",
                    "ERROR_CODE_PAYMENT_002"
                );
            }

            // Create and save the account record
            const account = this.accountRepo.create({
                payee: payee,
                accountNumber: accountResponse.accountNumber,
                accountName: accountResponse.accountName,
                bankCode: createAccountDto.bankCode,
                bankId: accountResponse.bankId,
                bankName: createAccountDto.bankName,
            });

            await this.accountRepo.save(account);
            console.log("Account record created:", account);

            return account;
        } catch (error) {
            console.error("Error in saveAccount:", error.message || error);
            throw error;
        }
    }





}

export default AccountService;

