import { MessageStatuses } from "../enums/message.statuses.enum.js";

export interface Messages {
  id: string;
  senderId: string;
  recipientid: string;
  message: string;
  status: MessageStatuses;
}
