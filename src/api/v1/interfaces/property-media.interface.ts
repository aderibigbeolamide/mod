import { Property } from "./property.interface.js";

export interface PropertyMedia {
  id: string;
  imageUrls: string[];
  videoUrls: string[];
  mediaIds: string[];
  leaseDocumentName: string;
  leaseDocumentUrl: string;
  property?: Property;
}
