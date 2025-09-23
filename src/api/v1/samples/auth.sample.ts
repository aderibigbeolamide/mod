import { CompleteSignUpDto, SignInDto, SignUpDto, FindByEmailOrPhoneDto } from "../dtos/auth.dto.js";

export namespace AuthSample {
  export const signIn: SignInDto = {
    phoneNumber: "+2348000000001",
    type: "default",
    password: "password1111",
  };

  export const signUp: SignUpDto = {
    type: "default",
    firstName: "User",
    lastName: "One",
    email: "user.one@zdmail.com",
    phoneNumber: "+2348000000001",
    password: "password1111",
  };

  export const completeSignUp: CompleteSignUpDto = {
    userType: "LESSOR",
    userTypeExtra: "Individual",
    noOfProperties: "6+",
  };


  // export const findByEmail: FindByEmailDto = {
  //   email: "user.one@zdmail.com",
  // };

  // export const findByPhoneNumber: FindByPhoneNumberDto = {
  //   phoneNumber: "+2348000000001",
  // };


  export const findByEmailOrPhone: FindByEmailOrPhoneDto = {
    email: "user.one@zdmail.com",
    phoneNumber: "+2348000000001",
    type: "email",

  };

  /* export const findByEmail: FindByEmailDto = {
    email: "user.one@zdmail.com",
    type: "default",
  };

  export const findByPhoneNumber: FindByPhoneNumberDto = {
    phoneNumber: "+2348000000001",
    type: "default",

  }; */


  export const user = {
    id: "1b1c098b-b0a7-43e2-8c8e-13fdd7f931a2",
    email: "user.one@zdmail.com",
    username: null,
    details_id: "2b3603cd-687e-4630-84e3-24b67af34352",
    role: null,
    is_active: true,
    phone_number: "+2348000000001",
    sign_in_type: "default",
    created_at: "2023-08-23T17:56:45.590Z",
    updated_at: "2023-08-23T17:56:45.590Z",
  };

  export const user2 = {
    id: "1b1c098b-b0a7-43e2-8c8e-13fdd7f931a2",
    email: "user.one@zdmail.com",
    phoneNumber: "+2348000000001",
    username: null,
    password: "$2b$10$YXF6ceiRRgAihj6Mk6o35egDRahuMhovS4K6phNlsmRbkcwNpPYBy",
    detailsId: "2b3603cd-687e-4630-84e3-24b67af34352",
    role: "LESSOR",
    isActive: true,
    signInType: "default",
    createdAt: "2023-08-23T17:56:45.590Z",
    updatedAt: "2023-09-27T22:01:47.615Z",
  };

  export const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMWMwOThiLWIwYTctNDNlMi04YzhlLTEzZmRkN2Y5MzFhMiIsImlhdCI6MTY5NTg1MTU1MCwiZXhwIjoxNjk1ODU1MTUwfQ.Qd0boogJJrfWN_Vj36bnxkW0WpM0h0ajcgLCSEbpiVQ";
}
