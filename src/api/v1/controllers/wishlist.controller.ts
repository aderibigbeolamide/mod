import { NextFunction, Request, Response, query } from "express";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import WishListService from "../services/wishlist.service.js";
import { CreateWishListDto } from "../dtos/wishlist.dto.js";
import { EErrorCode } from "../enums/errors.enum.js";
const { Client } = await import("pg");
import { connectionOptions } from "../../../config/database.config.js";
import type { ClientConfig } from "pg";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import { createObjectCsvWriter } from "csv-writer";

const WishListController = {
  save: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, propertyId } = req.body;
      if (userId && propertyId)
        Utility.sendResponse(res, {
          data: await WishListService.create(new CreateWishListDto(req.body)),
          message: `Successfully created a wishlist`,
        });
      else
        Utility.throwException({
          statusNo: 400,
          message: "user Id and Property Id is required",
          errorCode: EErrorCode.ERROR_CODE_400,
        });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { wishlistId } = req.params;
    const deletedWishlistItem = await WishListService.deleteWishList(wishlistId)

    Utility.sendResponse(res, {
      data: deletedWishlistItem,
      message: 'Wishlist deleted successfully'
    })
  },

  fetch: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;
    try {
      Utility.sendResponse(res, {
        data: await WishListService.fetchUserWishList(userId),
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  },

  exportTable: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const table = req.params.table;
    const format = req.query.format === 'json' ? 'json' : 'csv'; // default to csv
    // Ensure connectionOptions is compatible with ClientConfig
    const client = new Client(connectionOptions as ClientConfig);

    try {
      await client.connect();

      const result = await client.query(`SELECT * FROM ${table}`);
      const records = result.rows;

      if (records.length === 0) {
        Utility.sendResponse(res, {
          data: [],
          message: `No records found in table '${table}'.`,
        });
        return;
      }

      const tmpDir = path.join(__dirname, '../../tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      const fileName = `${table}_export.${format}`;
      const filePath = path.join(tmpDir, fileName);

      if (format === 'csv') {
        const csvWriter = createObjectCsvWriter({
          path: filePath,
          header: Object.keys(records[0]).map((key) => ({ id: key, title: key })),
        });
        await csvWriter.writeRecords(records);
      } else {
        fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
      }

      // Trigger file download
      res.download(filePath, fileName, (err) => {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) logger.error('Error deleting temp file:', unlinkErr);
        });

        if (err) {
          logger.error('Download error:', err);
          next(err);
        }
      });

    } catch (error: any) {
      logger.error(error.message);
      next(error);
    } finally {
      await client.end();
    }
  }

};

export default WishListController;
