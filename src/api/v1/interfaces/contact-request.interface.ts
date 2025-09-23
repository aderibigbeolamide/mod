export interface ContactRequest {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  topic: string;
  message: string;
}

export interface ContactRequestByDateRange {
  startDate: string;
  endDate: string;
}
