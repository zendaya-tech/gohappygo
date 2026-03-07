import { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '~/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { updateProfile, changePassword, deleteAccount, user } = useAuth();
  const { t } = useTranslation();

  // Parse firstName and lastName from user.name
  const nameParts = user?.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'account'>('profile');
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    aboutMe: user?.bio || '',
    phoneNumber: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePictureUrl || null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasActiveTransactions] = useState(false); // Simulate active transactions
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user data changes or dialog opens
  useEffect(() => {
    if (open && user) {
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Fetch full user data to get phone number
      const fetchUserData = async () => {
        try {
          const { getMe } = await import('~/services/authService');
          const userData = await getMe();

          setFormData({
            firstName: userData?.firstName || firstName,
            lastName: userData?.lastName || lastName,
            aboutMe: userData?.bio || user.bio || '',
            phoneNumber: userData?.phone || user?.phone || '',
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFormData({
            firstName: firstName,
            lastName: lastName,
            aboutMe: user.bio || '',
            phoneNumber: user?.phone || '',
          });
        }
      };

      fetchUserData();
      setProfileImage(user.profilePictureUrl || null);
    }
  }, [open, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.aboutMe,
        profilePicture: profileImageFile || undefined,
      });

      // Update the profile image immediately in the UI if it was uploaded
      if (profileImageFile && result && user) {
        // The backend should return the new profile picture URL
        // Update the local state to reflect the change immediately
        setProfileImage(profileImage); // Keep the preview image
      }

      setSuccess(t('profile.dialog.updateSuccess'));
      setTimeout(() => {
        onClose();
      }, 1000);
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 4000);
    } catch (err: any) {
      setError(err.message || t('profile.dialog.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="absolute  inset-0 z-50 ">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">{t('profile.dialog.settingsTitle')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover transition-colors cursor-pointer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover'
              }`}
            >
              {t('profile.dialog.tabs.profile')}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover'
              }`}
            >
              {t('profile.dialog.tabs.password')}
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer ${
                activeTab === 'account'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover'
              }`}
            >
              {t('profile.dialog.tabs.account')}
            </button>
          </div>

          {/* Content - Fixed Height with Scroll */}
          <div className="p-6 overflow-y-auto h-[500px]">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                {/* Profile Picture Upload */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div
                      className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">
                            {t('profile.dialog.uploadProfilePicture')}
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      placeholder={t('profile.dialog.firstName')}
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('profile.dialog.firstNameNote')}
                    </p>
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      placeholder={t('profile.dialog.lastName')}
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus"
                    />
                  </div>

                  {/* Phone Number - Disabled */}
                  <div>
                    <input
                      type="tel"
                      placeholder={t('profile.dialog.phoneNumber')}
                      value={formData.phoneNumber}
                      disabled
                      className="text-gray-400 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('profile.dialog.phoneImmutable')}
                    </p>
                  </div>

                  {/* About Me */}
                  <div>
                    <textarea
                      placeholder={t('profile.dialog.aboutMePlaceholder')}
                      value={formData.aboutMe}
                      onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                      rows={4}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    submitting
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 text-white hover'
                  }`}
                >
                  {submitting ? t('profile.dialog.saving') : t('profile.dialog.saveChanges')}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  setError(null);
                  setSuccess(null);

                  try {
                    await changePassword({
                      currentPassword: passwordData.currentPassword,
                      newPassword: passwordData.newPassword,
                    });

                    setSuccess(t('profile.dialog.passwordUpdateSuccess'));
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setTimeout(() => {
                      setSuccess(null);
                    }, 4000);
                  } catch (err: any) {
                    setError(err.message || t('profile.dialog.passwordUpdateError'));
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-6"
              >
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.dialog.currentPasswordLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder={t('profile.dialog.currentPasswordPlaceholder')}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover cursor-pointer"
                      >
                        {showPasswords.current ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.dialog.newPasswordLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder={t('profile.dialog.newPasswordPlaceholder')}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover cursor-pointer"
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('dialogs.register.validation.minLength')}
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.dialog.confirmPasswordLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder={t('profile.dialog.confirmPasswordPlaceholder')}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover cursor-pointer"
                      >
                        {showPasswords.confirm ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    submitting ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 text-white hover'
                  }`}
                >
                  {submitting
                    ? t('profile.dialog.passwordUpdating')
                    : t('profile.dialog.passwordUpdate')}
                </button>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        {t('profile.dialog.deleteAccount.title')}
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {t('profile.dialog.deleteAccount.description')}
                      </p>
                      {hasActiveTransactions && (
                        <p className="text-sm text-red-700 mt-2 font-medium">
                          {t('profile.dialog.deleteAccount.activeTransactionsWarning')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={hasActiveTransactions}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover transition-colors disabled cursor-pointer disabled:cursor-not-allowed"
                  >
                    {hasActiveTransactions
                      ? t('profile.dialog.deleteAccount.impossibleWithActiveTransactions')
                      : t('profile.dialog.deleteAccount.cta')}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        {t('profile.dialog.deleteAccount.confirmMessage')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover transition-colors cursor-pointer"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={async () => {
                          setSubmitting(true);
                          setError(null);
                          setSuccess(null);

                          try {
                            await deleteAccount();
                            setSuccess(t('profile.dialog.deleteAccount.success'));
                            setTimeout(() => {
                              onClose();
                              // Redirect to home page or login page
                              window.location.href = '/';
                            }, 2000);
                          } catch (err: any) {
                            setError(err.message || t('profile.dialog.deleteAccount.error'));
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        disabled={submitting}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                          submitting
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-red-600 text-white hover'
                        }`}
                      >
                        {submitting
                          ? t('profile.dialog.deleteAccount.submitting')
                          : t('profile.dialog.deleteAccount.confirmCta')}
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {t('profile.dialog.dataInfo.title')}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{t('profile.dialog.dataInfo.line1')}</p>
                    <p>{t('profile.dialog.dataInfo.line2')}</p>
                    <p>{t('profile.dialog.dataInfo.line3')}</p>
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover cursor-pointer">
                    {t('profile.dialog.dataInfo.downloadCta')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
