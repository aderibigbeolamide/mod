export const EErrorCode = {
  /** Unclassified error resulting from caught exceptions */
  ERROR_CODE_000: "err-000",
  /** Invalid, Expired or Missing Token */
  ERROR_CODE_AUTH_001: "auth-001",
  /** Unathorized */
  ERROR_CODE_AUTH_002: "auth-002",
  /** Validation for sign in failed */
  ERROR_CODE_AUTH_003: "auth-003",
  /** User not found */
  ERROR_CODE_AUTH_004: "auth-004",
  /** Password is incorrect */
  ERROR_CODE_AUTH_005: "auth-005",
  /** Validation for sign up failed */
  ERROR_CODE_AUTH_006: "auth-006",
  /** Unique constraint failure during sign up */
  ERROR_CODE_AUTH_007: "auth-007",
  /** Validation failed for OTP generation */
  ERROR_CODE_OTP_001: "otp-001",
  /** Validation failed for OTP validation */
  ERROR_CODE_OTP_002: "otp-002",
  /** Invalid OTP */
  ERROR_CODE_OTP_003: "otp-003",
  /** Item not found */
  ERROR_CODE_404: "err-404",
  /** Poorly formed request */
  ERROR_CODE_400: "err-400",
} as const;

export type EErrorCode = (typeof EErrorCode)[keyof typeof EErrorCode];
