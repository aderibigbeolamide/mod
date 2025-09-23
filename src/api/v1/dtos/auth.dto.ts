import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import Utility from "../../../utils/utility.js";

export class SignUpDto {
  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber: string;

  @IsString()
  public type: string;

  @IsOptional()
  @IsString()
  public password: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  constructor(obj?: any) {
    if (obj) {
      ["email", "password", "phoneNumber", "type", "firstName", "lastName"].forEach((prop) => {
        this[prop] = obj[prop];
      });
    }
  }
}

export class SignInDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsPhoneNumber()
  public phoneNumber?: string;

  @IsString()
  public type: string;

  @IsOptional()
  @IsString()
  public password: string;

  constructor(obj?: any) {
    if (obj) {
      ["email", "password", "phoneNumber", "type"].forEach((prop) => {
        this[prop] = obj[prop];
      });
    }
  }
}

export class forgetPasswordDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  constructor(obj?: any) {
    if (obj) {
      ["email"].forEach((prop) => {
        this[prop] = obj[prop];
      });
    }
  }
}

export class CompleteSignUpDto {
  @IsString()
  public userType: string;

  @IsString()
  public userTypeExtra: string;

  @IsString()
  @IsOptional()
  public noOfProperties?: string;

  constructor(obj?: any) {
    Utility.pickFieldsFromObject<CompleteSignUpDto>(obj, this, {
      userType: null,
      userTypeExtra: null,
      noOfProperties: null,
    });
  }
}


// The Data Transfer Object (DTO) used for finding a user by email
/* export class FindByEmailDto {
  
  // Optional property decorator; validates that 'email' is an email address
  @IsOptional()  // This field is optional, meaning it can be null or undefined
  @IsEmail()     // This field must be a valid email if provided
  public email: string;  
  
  // Constructor that optionally initializes the 'email' field if an object is passed in
  constructor(obj?: any) {
    // If an object is passed, loop over the properties ('email' in this case) 
    // and assign their values to the instance
    if (obj) {
      ["email"].forEach((prop) => {
        this[prop] = obj[prop];  // Assigns 'email' from the object to the class property
      });
    }
  }
}


// Data Transfer Object (DTO) class for finding a user by phone number
export class FindByPhoneNumberDto {

  // Optional property decorator; validates that 'phoneNumber' is a valid phone number
  @IsOptional()      // This field is optional, meaning it can be null or undefined
  @IsPhoneNumber()   // This field must be a valid phone number if provided
  public phoneNumber: string;  

  // Constructor that optionally initializes the 'phoneNumber' field if an object is passed in
  constructor(obj?: any) {
    // If an object is passed, loop over the 'phoneNumber' property and assign its value
    if (obj) {
      ["phoneNumber"].forEach((prop) => {
        this[prop] = obj[prop];  // Assigns 'phoneNumber' from the object to the class property
      });
    }
  }
} */


// Combined Data Transfer Object (DTO) for finding a user by email or phone number
export class FindByEmailOrPhoneDto {

  // Optional property decorator; validates that 'email' is an email address
  @IsOptional()  // This field is optional, meaning it can be null or undefined
  @IsEmail()     // This field must be a valid email if provided
  public email?: string;  
  
  // Optional property decorator; validates that 'phoneNumber' is a valid phone number
  @IsOptional()      // This field is optional, meaning it can be null or undefined
  @IsPhoneNumber()   // This field must be a valid phone number if provided
  public phoneNumber?: string;

  @IsString()
  public type: string;

  // Constructor that optionally initializes the 'email' and 'phoneNumber' fields if an object is passed in
  constructor(obj?: any) {
    // If an object is passed, assign 'email' and 'phoneNumber' values to the instance
    if (obj) {
      ["email", "phoneNumber", "type"].forEach((prop) => {
        this[prop] = obj[prop];  // Assigns 'email' and 'phoneNumber' from the object to the class properties
      });
    }
  }
}

/* export class FindByEmailDto {

  // Optional property decorator; validates that 'email' is an email address
  @IsOptional()  // This field is optional, meaning it can be null or undefined
  @IsEmail()     // This field must be a valid email if provided
  public email?: string;  
  
  @IsString()
  public type: string;

  // Constructor that optionally initializes the 'email' and 'phoneNumber' fields if an object is passed in
  constructor(obj?: any) {
    // If an object is passed, assign 'email' and 'phoneNumber' values to the instance
    if (obj) {
      ["email", "type"].forEach((prop) => {
        this[prop] = obj[prop];  // Assigns 'email' and 'phoneNumber' from the object to the class properties
      });
    }
  }
}
export class FindByPhoneNumberDto {


  // Optional property decorator; validates that 'phoneNumber' is a valid phone number
  @IsOptional()      // This field is optional, meaning it can be null or undefined
  @IsPhoneNumber()   // This field must be a valid phone number if provided
  public phoneNumber?: string;

  @IsString()
  public type: string;

  // Constructor that optionally initializes the 'email' and 'phoneNumber' fields if an object is passed in
  constructor(obj?: any) {
    // If an object is passed, assign 'email' and 'phoneNumber' values to the instance
    if (obj) {
      ["phoneNumber", "type"].forEach((prop) => {
        this[prop] = obj[prop];  // Assigns 'email' and 'phoneNumber' from the object to the class properties
      });
    }
  }
} */


