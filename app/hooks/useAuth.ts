import { useCallback } from 'react';
import { useAuthStore, type AuthState } from '../store/auth';
import {
  login as apiLogin,
  register as apiRegister,
  verifyEmail as apiVerifyEmail,
  updateProfile as apiUpdateProfile,
  changePassword as apiChangePassword,
  getMe as apiGetMe,
  deleteAccount as apiDeleteAccount,
  resendEmailVerification as apiResendEmailVerification,
  type LoginResponse,
  type UpdateProfileData,
  type ChangePasswordData,
} from '../services/authService';

export const useAuth = () => {
  const authStore = useAuthStore();
  const { login: storeLogin, logout: storeLogout, hydrateFromCookies } = authStore;

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = (await apiLogin(email, password)) as LoginResponse | null;

        if (!res || !res.access_token) {
          throw new Error('Identifiants invalides');
        }

        const composedUser = res.user
          ? {
              id: String(res.user.id),
              name:
                `${res.user.firstName ?? ''} ${res.user.lastName ?? ''}`.trim() ||
                (res.user.email ?? 'Utilisateur'),
              email: res.user.email,
              firstName: res.user.firstName,
              lastName: res.user.lastName,
              phone: res.user.phone,
              profilePictureUrl: res.user.profilePictureUrl,
              bio: res.user.bio,
              role: res.user.role,
              isPhoneVerified: res.user.isPhoneVerified,
              isVerified: res.user.isVerified,
              isAwaitingVerification: res.user.isAwaitingVerification,
              recentCurrency: res.user.recentCurrency,
              createdAt: res.user.createdAt ? new Date(res.user.createdAt) : undefined,
              profileStats: res.user.profileStats,
              stripeAccountId: res.user.stripeAccountId,
              stripeAccountStatus: res.user.stripeAccountStatus,
            }
          : {
              id: 'me',
              name: email.split('@')[0] || 'Utilisateur',
              email: email,
            };

        // Store token in localStorage
        try {
          window.localStorage.setItem('auth_token', res.access_token);
        } catch (e) {
          console.warn('Could not store token in localStorage:', e);
        }

        storeLogin(res.access_token, composedUser, res.refresh_token);

        return { success: true, user: composedUser };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    [storeLogin]
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
      phoneNumber?: string,
      countryCode?: string
    ) => {
      try {
        const res = await apiRegister(
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          countryCode
        );

        if (!res) {
          throw new Error("Échec de l'inscription. Réessayez.");
        }

        return {
          success: true,
          message: res.message || 'Inscription réussie. Vérifiez votre email.',
        };
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      }
    },
    []
  );

  const verifyEmail = useCallback(
    async (email: string, verificationCode: string) => {
      try {
        const res = await apiVerifyEmail(email, verificationCode);

        if (!res) {
          throw new Error('Code de vérification invalide. Réessayez.');
        }

        // Si la réponse contient un token d'accès, connecter automatiquement l'utilisateur
        if (res.access_token && res.user) {
          const composedUser = {
            id: String(res.user.id),
            name:
              `${res.user.firstName ?? ''} ${res.user.lastName ?? ''}`.trim() ||
              (res.user.email ?? 'Utilisateur'),
            email: res.user.email,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            phone: res.user.phone,
            profilePictureUrl: res.user.profilePictureUrl,
            bio: res.user.bio,
            role: res.user.role,
            isPhoneVerified: res.user.isPhoneVerified,
            isVerified: res.user.isVerified,
            isAwaitingVerification: res.user.isAwaitingVerification,
            recentCurrency: res.user.recentCurrency,
            createdAt: res.user.createdAt ? new Date(res.user.createdAt) : undefined,
            profileStats: res.user.profileStats,
            stripeAccountId: res.user.stripeAccountId,
            stripeAccountStatus: res.user.stripeAccountStatus,
          };

          // Stocker le token dans localStorage
          try {
            window.localStorage.setItem('auth_token', res.access_token);
          } catch (e) {
            console.warn('Could not store token in localStorage:', e);
          }

          // Connecter l'utilisateur
          storeLogin(res.access_token, composedUser, res.refresh_token);
        }

        return {
          success: true,
          message: res.message || 'Email vérifié avec succès!',
          user: res.user,
          isLoggedIn: !!res.access_token,
        };
      } catch (error) {
        console.error('Verify email error:', error);
        throw error;
      }
    },
    [storeLogin]
  );

  const resendEmailVerification = useCallback(async (email: string) => {
    try {
      const res = await apiResendEmailVerification(email);

      if (!res) {
        throw new Error("Échec de l'envoi du code de vérification. Réessayez.");
      }

      return {
        success: true,
        message: res.message || 'Code de vérification envoyé avec succès!',
      };
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem('auth_token');
    } catch (e) {
      console.warn('Could not remove token from localStorage:', e);
    }
    storeLogout();
  }, [storeLogout]);

  const authenticate = useCallback(async () => {
    try {
      // First try to get token from localStorage
      const token = window.localStorage.getItem('auth_token');
      // if (!token) {
      //   // If no token, try hydrating from cookies as fallback
      //   hydrateFromCookies();
      //   return;
      // }

      // If we have a token, verify it with the server
      const userData = await apiGetMe();

      if (userData) {
        const composedUser = {
          id: String(userData.id),
          name:
            `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() ||
            (userData.email ?? 'Utilisateur'),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          profilePictureUrl: userData.profilePictureUrl,
          bio: userData.bio,
          role: userData.role,
          isPhoneVerified: userData.isPhoneVerified,
          isVerified: userData.isVerified,
          isAwaitingVerification: userData.isAwaitingVerification,
          recentCurrency: userData.recentCurrency,
          createdAt: new Date(userData.createdAt),
          profileStats: userData.profileStats,
          stripeAccountId: userData.stripeAccountId,
          stripeAccountStatus: userData.stripeAccountStatus,
        };

        storeLogin(token!, composedUser);
      } else {
        // If API call fails, remove invalid token and fallback to cookies
        window.localStorage.removeItem('auth_token');
        hydrateFromCookies();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // If API call fails, remove invalid token and fallback to cookies
      try {
        window.localStorage.removeItem('auth_token');
      } catch (e) {
        console.warn('Could not remove token from localStorage:', e);
      }
      hydrateFromCookies();
    }
  }, [hydrateFromCookies, storeLogin]);

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      try {
        const res = await apiUpdateProfile(data);

        // Update user in store if successful
        if (res && authStore.user) {
          const updatedUser = {
            ...authStore.user,
            name:
              data.firstName && data.lastName
                ? `${data.firstName} ${data.lastName}`.trim()
                : authStore.user.name,
            firstName: data.firstName || authStore.user.firstName,
            lastName: data.lastName || authStore.user.lastName,
            phone: data.phone || authStore.user.phone,
            profilePictureUrl:
              res.user?.profilePictureUrl ||
              res.profilePictureUrl ||
              authStore.user.profilePictureUrl,
            bio: data.bio || authStore.user.bio,
          };
          storeLogin(authStore.token!, updatedUser);
        }

        return {
          success: true,
          message: res.message || 'Profil mis à jour avec succès!',
        };
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    },
    [authStore.user, authStore.token, storeLogin]
  );

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      const res = await apiChangePassword(data);
      return {
        success: true,
        message: res.message || 'Mot de passe modifié avec succès!',
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      const res = await apiDeleteAccount();

      // Logout user after successful account deletion
      logout();

      return {
        success: true,
        message: res.message || 'Compte supprimé avec succès!',
      };
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }, [logout]);

  return {
    // State
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isLoggedIn,

    // Methods
    login,
    register,
    verifyEmail,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
    authenticate,
    resendEmailVerification,
  };
};
