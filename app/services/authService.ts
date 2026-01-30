import api from './Api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const register = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string,
  countryCode?: string
) => {
  try {
    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);
    if (firstName) formData.append('firstName', firstName);
    if (lastName) formData.append('lastName', lastName);
    if (phoneNumber) formData.append('phoneNumber', phoneNumber);
    if (countryCode) formData.append('countryCode', countryCode);

    const response = await api.post(`/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Throw instead of returning null to handle errors properly
  }
};

export const verifyEmail = async (email: string, verificationCode: string) => {
  try {
    const response = await api.post(`/auth/verify-email`, {
      email,
      verificationCode,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resendEmailVerification = async (email: string) => {
  try {
    const response = await api.post(`/auth/resend-email-verification`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const formData = new FormData();

    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.bio) formData.append('bio', data.bio);
    if (data.phone) formData.append('phone', data.phone);
    if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

    const response = await api.patch(`/user/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await api.put(`/user/change-password`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

export const getMe = async (userId?: string | number): Promise<GetMeResponse | null> => {
  try {
    const params = userId ? { userId } : {};
    const response = await api.get(`/auth/me`, { params });
    return response.data;
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete(`/auth/delete`);
    return response.data;
  } catch (error) {
    console.error('Delete account error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post(`/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (code: string, password: string) => {
  try {
    const response = await api.post(`/auth/reset-password?code=${code}`, { 
      password 
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  user?: {
    profilePictureUrl?: string;
    id: string | number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
    role?: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
    isPhoneVerified?: boolean;
    isVerified?: boolean;
    isAwaitingVerification?: boolean;
    recentCurrency?: any;
    createdAt?: string;
    profileStats?: ProfileStats;
    stripeAccountId?: string | null;
    stripeAccountStatus?: 'uninitiated' | 'pending' | 'active' | 'restricted';
  };
};

export type UpdateProfileData = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  profilePicture?: File;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type VerifyEmailResponse = {
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string | number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    username?: string;
    profilePictureUrl?: string;
    bio?: string;
    role?: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
    isDeactivated: boolean;
    isPhoneVerified: boolean;
    isVerified: boolean;
    isAwaitingVerification: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type ProfileStats = {
  demandsCount: number;
  travelsCount: number;
  bookMarkTravelCount: number;
  bookMarkDemandCount: number;
  requestsCompletedCount: number;
  requestsNegotiatingCount: number;
  requestsCancelledCount: number;
  requestsAcceptedCount: number;
  requestsRejectedCount: number;
  reviewsReceivedCount: number;
  reviewsGivenCount: number;
  transactionsCompletedCount: number;
};

export type GetMeResponse = {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  username?: string;
  profilePictureUrl?: string;
  bio?: string;
  role?: {
    id: number;
    name: string;
    code: string;
    description: string;
  };
  isDeactivated: boolean;
  isPhoneVerified: boolean;
  isVerified: boolean;
  isAwaitingVerification: boolean;
  recentCurrency?: any;
  createdAt: string;
  updatedAt: string;
  profileStats?: ProfileStats;
  stripeAccountId?: string | null;
  stripeAccountStatus?: 'uninitiated' | 'pending' | 'active' | 'restricted';
};
