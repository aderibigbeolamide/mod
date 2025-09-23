import { NextFunction, Request, Response, query } from "express";
import Utility from "../../../utils/utility.js";
import { EErrorCode } from "../enums/errors.enum.js";
import  PaymentTransactionService  from "../services/paymentTransaction.service.js";


const PaymentTransactionController = {

    createPaymentTransaction: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { paymentId, requestToRentId } = req.params; // Assuming both are passed as URL params. Alternatively, you can get `requestToRentId` from req.body if needed.
    
            // Validate that both IDs are provided
            if (!paymentId || !requestToRentId) {
                Utility.throwException({
                    statusNo: 400,
                    message: "Payment ID and RequestToRent ID are required",
                    errorCode: EErrorCode.ERROR_CODE_400,
                });
            }
    
            // Pass both IDs to the service method
            const transaction = await new PaymentTransactionService().createPaymentTransaction(paymentId, requestToRentId);
    
            // Send response
            Utility.sendResponse(res, {
                data: transaction,
                message: "Transaction has been created successfully",
            });
        } catch (error) {
            Utility.returnError(res, error);
        }
    },

    getTransactionById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const transactionId: string = req.params["transactionId"];
            if (!transactionId) {
                Utility.throwException({
                    message: "Transaction ID is required",
                    statusNo: 400,
                    errorObject: { transactionId },
                });
            }
    
            const transaction = await new PaymentTransactionService().getTransactionById(transactionId);
            if (!transaction) {
                Utility.throwException({
                    message: "Transaction not found",
                    statusNo: 404,
                    errorObject: { transactionId },
                });
            }
    
            Utility.sendResponse(res, {
                data: transaction,
                message: "Transaction retrieved successfully",
            });
        } catch (error) {
            Utility.returnError(res, error);
        }
    },

    getAllPendingTransactions: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const transactions = await new PaymentTransactionService().getAllPendingTransactions();
            Utility.sendResponse(res, {
                data: transactions,
                message: "All pending transactions retrieved successfully",
            });
        } catch (error) {
            Utility.returnError(res, error);
        }
    },

    getAllConfirmedTransactions: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const transactions = await new PaymentTransactionService().getAllConfirmedTransactions();
            Utility.sendResponse(res, {
                data: transactions,
                message: "All confirmed transactions retrieved successfully",
            });
        } catch (error) {
            Utility.returnError(res, error);
        }
    },    

}

export default PaymentTransactionController;
function next(error: any) {
    throw new Error("Function not implemented.");
}

