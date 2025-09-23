export interface ITourRequest {
  id: string;
  meetDate: Date;
  email: string;
  phone: string;
  preferVirtualTour: boolean;
}

export interface ICreateTourRequest {
  meetDate: Date;
  email: string;
  phone: string;
  preferVirtualTour: boolean;
}
