import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import { dataSource } from "../../../config/database.config.js";
import { ContactRequestEntity } from "../entities/contact-request.entity.js";
import ContatcRequestService from "../services/contact-request.service.js";
import { createObjectCsvWriter } from "csv-writer";

const ContactRequestController = {
  createContactRequest: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { fullname, email, phoneNumber, topic, message } = req.body;

      const newEntry = await ContatcRequestService.NewContactRequest(
        fullname,
        email,
        phoneNumber,
        topic,
        message
      );
      Utility.sendResponse(res, {
        data: newEntry,
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  contactRequest: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const contactRequest =
      startDate && endDate
        ? await ContatcRequestService.getContactRequestByDateRange(startDate, endDate)
        : await ContatcRequestService.getContactRequestDefault();

      Utility.sendResponse(res, {
        data: contactRequest,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  download: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const contactRequest =
        startDate && endDate
          ? await ContatcRequestService.getContactRequestByDateRange(startDate, endDate)
          : await ContatcRequestService.getContactRequestDefault();

      const csvWriter = createObjectCsvWriter({
        path: "contactRequest.csv",
        header: [
          { id: "fullname", title: "Fullname" },
          { id: "email", title: "Email" },
          { id: "phoneNumber", title: "phoneNumber" },
          { id: "topic", title: "Topic" },
          { id: "message", title: "Message" },
          { id: "createdAt", title: "createdAt" },
        ],
      });

      const records = contactRequest.map((entry) => ({
        fullname: entry.fullname,
        email: entry.email,
        phoneNumber: entry.phoneNumber,
        topic: entry.topic,
        message: entry.message,
        createdAt: entry.createdAt,
      }));

      await csvWriter.writeRecords(records);

      res.download("contactRequest.csv", "contactRequest.csv");
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },
};

export default ContactRequestController;
