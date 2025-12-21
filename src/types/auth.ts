export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  avatar: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isVerified: string;
  userPreferences: {
    enable2FA: boolean;
    emailNotification: boolean;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  verificationId?: {
    type: string;
    uploadedAt: string;
  };
}

export interface AuthResponse {
  message: string;
  mfaRequired?: boolean;
  user?: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailPayload {
  code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
