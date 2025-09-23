import { MediaCategories } from "../enums/media-categories.enum.js";
import { MediaRefCategories } from "../enums/media-ref-categories.enum.js";
import { MediaTypes } from "../enums/media-types.enum.js";

export interface Media {
  id: string;
  publicUrl: string;
  refId: string;
  refCategory: MediaRefCategories;
  mediaType: MediaTypes;
  mediaCategory: MediaCategories;
  isPublic: boolean;
  size: number;
  sizeMetric: string;
  mediaExt: string;
  mediaFileName: string;
  uploadedBy: string;
  isTemp: boolean;
}
