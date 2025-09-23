import { NextFunction, Request, Response, query } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import WaitListService from "../services/waitlist.service.js";
import { createObjectCsvWriter } from "csv-writer";

const WaitListController = {
  joinWaitList: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const existingEntry = await WaitListService.getByEmail(email);

      const newWaitListEntry = await WaitListService.create(email);
      Utility.sendResponse(res, {
        data: !existingEntry ? newWaitListEntry : null,
        message: existingEntry ? "Email already exits in waitlist" : "Successfully joined waitlist",
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  waitlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const waitlist =
        startDate && endDate
          ? await WaitListService.getWaitListByDateRange(startDate, endDate)
          : await WaitListService.getWaitListDefault();

      Utility.sendResponse(res, {
        data: waitlist,
      });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },

  download: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const waitlist =
        startDate && endDate
          ? await WaitListService.getWaitListByDateRange(startDate, endDate)
          : await WaitListService.getWaitListDefault();

          const csvWriter = createObjectCsvWriter({
            path: 'waitlist.csv',
            header: [
              { id: 'email', title: 'Email' },
              { id: 'createdAt', title: 'createdAt' },
              { id: 'updatedAt', title: 'updatedAt' },
            ],
          });
      
          const records = waitlist.map((entry) => ({
            email: entry.email,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt
          }));
      
          await csvWriter.writeRecords(records);

      // Utility.sendResponse(res, {
      //   data: waitlist,
      // });
      res.download('waitlist.csv', 'waitlist.csv');
    } catch (err) {
      logger.error(err);
      next(err);
    }
  },
};

export default WaitListController;
