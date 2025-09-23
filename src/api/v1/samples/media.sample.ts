import UploadMediaDto from "../dtos/upload-media.dto.js";
import { MediaCategories } from "../enums/media-categories.enum.js";
import { MediaRefCategories } from "../enums/media-ref-categories.enum.js";
import { MediaTypes } from "../enums/media-types.enum.js";
import { Media } from "../interfaces/media.interface.js";

export namespace MediaSample {
  export const uploadMediaDto: UploadMediaDto = {
    refId: "prop-1",
    refCategory: "PROPERTY",
    mediaType: "IMAGE",
    mediaCategory: "GALLERY_IMAGE",
    isPublic: true,
    files: ["file1.png", "file2.png"],
  };

  export const media: Media = {
    id: "mediaid1111",
    publicUrl:
      "https://letbud-pub-store.s3.eu-west-2.amazonaws.com/local/GALLERY_IMAGE/IMAGE/prop-1_1695856050838_981029688.png",
    refId: "prop-1",
    refCategory: MediaRefCategories.PROPERTY,
    mediaType: MediaTypes.IMAGE,
    mediaCategory: MediaCategories.GALLERY_IMAGE,
    isPublic: true,
    size: 121.4306640625,
    sizeMetric: "kb",
    mediaExt: ".png",
    mediaFileName: "prop-1_1695856050838_981029688.png",
    uploadedBy: "userId1111",
    isTemp: true,
  };
}
