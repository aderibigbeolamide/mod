import { FaqTypes } from "../enums/faq.types.enum.js";

export interface Faq {
  id: string;
  type: FaqTypes;
  title: string;
  answer: string;
  listResponse: string[];
  entityId: string;
  faqQuestionId: string;
}
