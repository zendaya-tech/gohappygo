import { useState, useRef, useEffect } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useAuth } from "../../../hooks/useAuth";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { updateProfile, changePassword, deleteAccount, user } = useAuth();

  // Parse firstName and lastName from user.name
  const nameParts = user?.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "account"
  >("profile");
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: "",
    aboutMe: user?.bio || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePictureUrl || null
  );
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
      const nameParts = user.name?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Fetch full user data to get phone number
      const fetchUserData = async () => {
        try {
          const { getMe } = await import("~/services/authService");
          const userData = await getMe();

          setFormData({
            firstName: userData?.firstName || firstName,
            lastName: userData?.lastName || lastName,
            phoneNumber: userData?.phone || "",
            aboutMe: userData?.bio || user.bio || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setFormData({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: "",
            aboutMe: user.bio || "",
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

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
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
        phone: formData.phoneNumber,
        profilePicture: profileImageFile || undefined,
      });

      // Update the profile image immediately in the UI if it was uploaded
      if (profileImageFile && result && user) {
        // The backend should return the new profile picture URL
        // Update the local state to reflect the change immediately
        setProfileImage(profileImage); // Keep the preview image
      }

      setSuccess("Profil mis à jour avec succès!");
      setTimeout(() => {
        setSuccess(null);
      }, 4000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="absolute  inset-0 z-50 ">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">
              Paramètres du profil
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mot de passe
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "account"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Compte
            </button>
          </div>

          {/* Content - Fixed Height with Scroll */}
          <div className="p-6 overflow-y-auto h-[500px]">
            {activeTab === "profile" && (
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
                      className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
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
                            Upload profile picture
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
                      placeholder="Prénom (tel que sur la pièce d'identité)"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      (Seul votre prénom apparaît sur la plateforme)
                    </p>
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      placeholder="Nom de famille (tel que sur la pièce d'identité)"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Phone Number with Country Code */}
                  <div>
                    <PhoneInput
                      defaultCountry="fr"
                      value={formData.phoneNumber}
                      onChange={(phone) =>
                        handleInputChange("phoneNumber", phone)
                      }
                      inputClassName="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                      countrySelectorStyleProps={{
                        className:
                          "border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed",
                      }}
                      inputProps={{
                        placeholder: "Numéro de téléphone",
                        disabled: true,
                      }}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      (Le numéro de téléphone ne peut pas être modifié)
                    </p>
                  </div>

                  {/* About Me */}
                  <div>
                    <textarea
                      placeholder="About me"
                      value={formData.aboutMe}
                      onChange={(e) =>
                        handleInputChange("aboutMe", e.target.value)
                      }
                      rows={4}
                      className="text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    submitting
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submitting
                    ? "Sauvegarde en cours..."
                    : "Sauvegarder les modifications"}
                </button>
              </form>
            )}

            {activeTab === "password" && (
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

                    setSuccess("Mot de passe modifié avec succès!");
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setTimeout(() => {
                      setSuccess(null);
                    }, 4000);
                  } catch (err: any) {
                    setError(
                      err.message || "Erreur lors du changement de mot de passe"
                    );
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
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Entrez votre mot de passe actuel"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Le mot de passe doit contenir au moins 8 caractères
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirmez votre nouveau mot de passe"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="text-gray-500 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    submitting ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submitting
                    ? "Mise à jour en cours..."
                    : "Mettre à jour le mot de passe"}
                </button>
              </form>
            )}

            {activeTab === "account" && (
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
                        Suppression du compte
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Cette action est irréversible. Toutes vos données seront
                        définitivement supprimées.
                      </p>
                      {hasActiveTransactions && (
                        <p className="text-sm text-red-700 mt-2 font-medium">
                          ⚠️ Vous ne pouvez pas supprimer votre compte car vous
                          avez des transactions en cours.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={hasActiveTransactions}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {hasActiveTransactions
                      ? "Suppression impossible (transactions en cours)"
                      : "Supprimer mon compte"}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Êtes-vous sûr de vouloir supprimer votre compte ? Cette
                        action ne peut pas être annulée.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={async () => {
                          setSubmitting(true);
                          setError(null);
                          setSuccess(null);

                          try {
                            await deleteAccount();
                            setSuccess("Compte supprimé avec succès!");
                            setTimeout(() => {
                              onClose();
                              // Redirect to home page or login page
                              window.location.href = "/";
                            }, 2000);
                          } catch (err: any) {
                            setError(
                              err.message ||
                                "Erreur lors de la suppression du compte"
                            );
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        disabled={submitting}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          submitting
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {submitting
                          ? "Suppression en cours..."
                          : "Confirmer la suppression"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Informations sur les données
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      • Vos données personnelles seront supprimées dans les 30
                      jours
                    </p>
                    <p>• Les messages et transactions seront anonymisés</p>
                    <p>
                      • Vous pouvez télécharger vos données avant suppression
                    </p>
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                    Télécharger mes données
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
