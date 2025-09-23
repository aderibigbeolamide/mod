export const AppName = "Letbud";
export const v1Base = "/api/v1/";
export const PASSWORD_SALT = 10;
export const OTP_VALIDITY_MIN = 5;

/** Response Statuses */
export const STATUS_SUCCESS = "success";
export const STATUS_FAIL = "fail";
export const STATUS_ERROR = "error";
/** Response Statuses */

/** Error Codes */
export const ERROR_CODE_000 = "err-000"; // Unclassified error resulting from caught exceptions

//Auth errors
export const ERROR_CODE_AUTH_001 = "auth-001"; // Invalid, Expired or Missing Token
export const ERROR_CODE_AUTH_002 = "auth-002"; // Unathorized
export const ERROR_CODE_AUTH_003 = "auth-003"; // Validation for sign in failed
export const ERROR_CODE_AUTH_004 = "auth-004"; // User not found
export const ERROR_CODE_AUTH_005 = "auth-005"; // Password is incorrect
export const ERROR_CODE_AUTH_006 = "auth-006"; // Validation for sign up failed
export const ERROR_CODE_AUTH_007 = "auth-007"; // Unique constraint failure during sign up

// Otp errors
export const ERROR_CODE_OTP_001 = "otp-001"; // Validation failed for OTP generation
export const ERROR_CODE_OTP_002 = "otp-002"; // Validation failed for OTP validation
export const ERROR_CODE_OTP_003 = "otp-003"; // Invalid OTP

// Media errors
export const ERROR_CODE_MEDIA_001 = "md-001"; // Validation failed for upload media
// General error
/** Item not found */
export const ERROR_CODE_404 = "err-404";
/** Poorly formed request */
export const ERROR_CODE_400 = "err-400";

/** Error Codes */

/** Sign in types */
export const SIGN_IN_TYPE_DEFAULT = "default";
export const SIGN_IN_TYPE_GOOGLE = "google";
export const SIGN_IN_TYPES = [SIGN_IN_TYPE_DEFAULT, SIGN_IN_TYPE_GOOGLE];
/** Sign in types */

/** Ref Categories */
export const REF_CATEGORY_ = "default";
/** Ref Categories */
