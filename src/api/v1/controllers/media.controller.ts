import { NextFunction, Request, Response } from "express";
import { logger } from "../../../config/logger.js";
import UploadMediaDto from "../dtos/upload-media.dto.js";
import { ERROR_CODE_MEDIA_001, STATUS_FAIL, STATUS_SUCCESS } from "../../../config/constants.js";
import { MediaRefCategories } from "../enums/media-ref-categories.enum.js";
import { HttpException } from "../exceptions/http.exception.js";
import { MediaTypes } from "../enums/media-types.enum.js";
import { MediaCategories } from "../enums/media-categories.enum.js";
import { ValidationError, validate } from "class-validator";
import MediaService from "../services/media.service.js";
import Utility from "../../../utils/utility.js";

const MediaController = {
  uploadMedia: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let uploadMediaDto = new UploadMediaDto(req.body);
      uploadMediaDto.isPublic = JSON.parse(req.body.isPublic);
      let files = req.files;

      if (
        !Object.values(MediaRefCategories)
          .map((val) => val.toString())
          .includes(uploadMediaDto.refCategory)
      ) {
        new MediaService().cleanup(req.files as Express.Multer.File[]);
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "refCategory can either be PROPERTY or PROPERTY_APPLICATION",
            ERROR_CODE_MEDIA_001
          )
        );
      }

      if (
        !Object.values(MediaTypes)
          .map((val) => val.toString())
          .includes(uploadMediaDto.mediaType)
      ) {
        new MediaService().cleanup(req.files as Express.Multer.File[]);
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "mediaType can either be be AUDIO, VIDEO, IMAGE or DOCUMENT",
            ERROR_CODE_MEDIA_001
          )
        );
      }

      if (
        !Object.values(MediaCategories)
          .map((val) => val.toString())
          .includes(uploadMediaDto.mediaCategory)
      ) {
        new MediaService().cleanup(req.files as Express.Multer.File[]);
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "mediaCategory can either be be GALLERY_IMAGE, PROFILE_IMAGE, GALLERY_VIDEO or LEASE_DOCUMENT",
            ERROR_CODE_MEDIA_001
          )
        );
      }

      let errors: ValidationError[] = await validate(uploadMediaDto, {
        validationError: { target: false },
        whitelist: true,
      });
      if (errors.length > 0) {
        new MediaService().cleanup(req.files as Express.Multer.File[]);
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "Upload Media Validation failed validation failed",
            ERROR_CODE_MEDIA_001,
            errors
          )
        );
      }

      if (files.length == 0) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            "At least one file is required for upload",
            ERROR_CODE_MEDIA_001,
            errors
          )
        );
      }

      uploadMediaDto.createdBy = req.sender?.id;
      let media = await new MediaService().uploadFile(
        uploadMediaDto,
        files as Express.Multer.File[], // multer.array is being used
        req.sender
      );
      Utility.sendResponse(res, {
        status: STATUS_SUCCESS,
        message: "Media successfully uploaded",
        data: { media },
      });
    } catch (error) {
      logger.error("An error occured uploading media");
      logger.error(error);
      new MediaService().cleanup(req.files as Express.Multer.File[]);
      next(error);
    }
  },

  deleteMedia: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mediaId = req.params.id;
      if (!mediaId) {
        return next(
          new HttpException(400, STATUS_FAIL, "Media ID is required", ERROR_CODE_MEDIA_001)
        );
      }

      const mediaService = new MediaService();
      const deletedMedia = await mediaService.deleteFromS3(mediaId, true);

      Utility.sendResponse(res, {
        status: STATUS_SUCCESS,
        message: "Media successfully deleted",
        data: { media: deletedMedia },
      });
    } catch (error) {
      logger.error("An error occurred deleting media");
      logger.error(error);
      next(error);
    }
  },
};

export default MediaController;
