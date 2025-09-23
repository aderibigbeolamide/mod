import { dataSource } from "../../../config/database.config.js";
import Utility from "../../../utils/utility.js";
import UploadMediaDto from "../dtos/upload-media.dto.js";
import { MediaEntity } from "../entities/media.entity.js";
import { MediaCategories } from "../enums/media-categories.enum.js";
import { MediaRefCategories } from "../enums/media-ref-categories.enum.js";
import { MediaTypes } from "../enums/media-types.enum.js";
import { Media } from "../interfaces/media.interface.js";
import { User } from "../interfaces/user.interface.js";
import fs from "fs";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "../../../config/logger.js";

class MediaService {
  public async uploadFile(
    uploadMediaDto: UploadMediaDto,
    files: Express.Multer.File[],
    sender: User
  ): Promise<Media[]> {
    try {
      let media = [];

      for (let file of files) {
        let ext = file.mimetype;
        ext = "." + ext.substring(ext.indexOf("/") + 1);
        let fileName = `${uploadMediaDto.refId}_${Date.now()}_${Math.round(
          Math.random() * 1e9
        )}${ext}`;

        // ✅ Force isPublic to true
        const isPublic = true;

        let publicUrl = await this.uploadFileToStorage(file, fileName, {
          ...uploadMediaDto,
          isPublic,
        });

        const mediaFile: Media = await dataSource.getRepository(MediaEntity).save({
          publicUrl: publicUrl,
          refId: uploadMediaDto.refId,
          refCategory: Utility.stringToEnum(MediaRefCategories, uploadMediaDto.refCategory),
          mediaType: Utility.stringToEnum(MediaTypes, uploadMediaDto.mediaType),
          mediaCategory: Utility.stringToEnum(MediaCategories, uploadMediaDto.mediaCategory),
          isPublic: isPublic, // ✅ always true
          size: Number(file.size) / 1024,
          sizeMetric: "kb",
          mediaExt: ext,
          mediaFileName: fileName,
          uploadedBy: sender?.id,
          isTemp: true,
        });
        media.push(mediaFile);
      }

      this.cleanup(files);
      return media;
    } catch (error) {
      logger.error("Error uploading media is", error);
      throw error;
    }
  }

  async uploadFileToStorage(
    file: Express.Multer.File,
    fileName: string,
    uploadMediaDto: UploadMediaDto
  ) {
    let uploadKey = `${process.env.NODE_ENV}/${uploadMediaDto.mediaCategory}/${uploadMediaDto.mediaType}/${fileName}`;
    let location = await this.uploadToS3(file.path, uploadKey, true); // ✅ force public
    return location;
  }

  cleanup(files: Express.Multer.File[]) {
    try {
      for (let file of files) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      logger.error("Error cleaning up temp files is", error);
    }
  }

  async uploadToS3(filepath: string, key: string, isPublic: boolean): Promise<string> {
    try {
      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const fileContent = fs.readFileSync(filepath);
      const mimeType = this.getMimeType(filepath);

      // ✅ Always use public bucket
      let bucketName = process.env.S3_PUBLIC_BUCKET;

      const params: any = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: mimeType,
        ContentDisposition: 'inline',
      };

      if (mimeType === "application/pdf" || mimeType.includes("msword") || mimeType.includes("officedocument")) {
        params.ContentDisposition = "inline";
      }

      const command = new PutObjectCommand(params);
      await s3.send(command);

      logger.info(`File uploaded successfully: ${key}`);

      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      logger.error("Error uploading media file is", error);
      throw error;
    }
  }

  private getMimeType(filepath: string): string {
    const ext = filepath.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "mp4":
        return "video/mp4";
      default:
        return "application/octet-stream";
    }
  }

  deleteFromS3 = async (key: string, isPublic: boolean) => {
    try {
      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      // ✅ Always delete from public bucket
      let bucketName = process.env.S3_PUBLIC_BUCKET;

      if (key.startsWith("http")) {
        key = this.s3UrlToKey(key);
      }

      const params = {
        Bucket: bucketName,
        Key: key,
      };

      const data = await s3.send(new DeleteObjectCommand(params));
      logger.info("Success. Object deleted.", data);
    } catch (error) {
      logger.error("An error occured deleting s3 object", error);
      throw error;
    }
  };

  s3UrlToKey = (url: string) => {
    let ind = url.indexOf(process.env.NODE_ENV + "/");
    let resp = url.slice(ind);
    resp = resp.replace(/%20/g, " ");
    resp = resp.replace(/%40/g, "@");
    return resp;
  };
}

export default MediaService;
