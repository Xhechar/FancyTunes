import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Shield,
  Settings,
  LogOut,
  Trash2
} from 'lucide-react';
import styles from "../../../styles/user/user_routes/Profile.module.css";
import { User as UserInterface } from '../../../interfaces/interfaces';
import { UsersService } from '../../../services/user.service';
import Toast, { ToastProps } from '../../../components/Toast';
import { UpdateUserDto } from '../../../interfaces/dtos/interfaces.dtos';

interface ProfileFormData {
  FullName: string;
  Email: string;
  Phone: string;
  CurrentPassword?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
  DateOfBirth?: string;
  Address?: string;
  City?: string;
  Country?: string;
  Bio?: string;
  NotificationsEnabled: boolean;
  TwoFactorEnabled: boolean;
  MarketingEmails: boolean;
};

export const Profile: React.FC = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [ toast, setToast ] = useState<ToastProps | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    reset  } = useForm<ProfileFormData>({
    defaultValues: {
      FullName: '',
      Email: '',
      Phone: '',
      DateOfBirth: '',
      Address: '',
      City: '',
      Country: '',
      Bio: '',
      NotificationsEnabled: true,
      TwoFactorEnabled: false,
      MarketingEmails: true
    },
    mode: 'onChange'
  });

  useEffect(() => {
    const getUser = async() => {
      try {
        const result = await UsersService.GetUserByUserId();

        if (result.success) {
          setUser(result.data as UserInterface);

          const fetched = result.data as any;

          reset({
            FullName: fetched?.FullName ?? '',
            Email: fetched?.Email ?? '',
            Phone: fetched?.Phone ?? '',
            DateOfBirth: fetched?.DateOfBirth ? String(fetched.DateOfBirth).split('T')[0] : '',
            Address: fetched?.Address ?? '',
            City: fetched?.City ?? '',
            Country: fetched?.Country ?? '',
            Bio: fetched?.Bio ?? '',
            NotificationsEnabled: fetched?.NotificationsEnabled ?? true,
            TwoFactorEnabled: fetched?.TwoFactorEnabled ?? false,
            MarketingEmails: fetched?.MarketingEmails ?? true
          });

          if (fetched?.ProfileImage) {
            setProfileImage(fetched.ProfileImage);
          }

          setToast({
            isVisible: true,
            type: 'success',
            title: 'SUCCESS',
            message: result.message as string,
            onClose() {
              setToast(null);
            }
          });
        } else {
          setToast({
            isVisible: true,
            type: 'warning',
            title: 'NOTICE',
            message: result.message as string,
            onClose() {
              setToast(null);
            }
          });
        }
      } catch (err: any) {
        setToast({
          isVisible: true,
          type: 'error',
          title: 'ERROR',
          message: err?.message ?? 'Failed to fetch user',
          onClose() {
            setToast(null);
          }
        });
      }
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newPassword = watch('NewPassword');

  const validationRules = {
    FullName: {
      required: "Full name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters long",
      },
      maxLength: {
        value: 50,
        message: "Name cannot exceed 50 characters",
      },
      pattern: {
        value: /^[a-zA-Z\s'-]+$/,
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes",
      },
    },
    Email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
    Phone: {
      required: "Phone number is required",
      pattern: {
        // eslint-disable-next-line
        value: /^\+?[\d\s\-\(\)]+$/,
        message: "Please enter a valid phone number",
      },
      minLength: {
        value: 10,
        message: "Phone number must be at least 10 digits",
      },
    },
    CurrentPassword: {
      required:
        isEditing && newPassword
          ? "Current password is required when setting a new password"
          : false,
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters long",
      },
    },
    NewPassword: {
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters long",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    },
    ConfirmPassword: {
      validate: (value: string | undefined) => {
        if (newPassword && !value) {
          return "Please confirm your new password";
        }
        if (value && value !== newPassword) {
          return "Passwords do not match";
        }
        return true;
      },
    },
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setSaveStatus('saving');

    const userData: UpdateUserDto = {
      FullName: data.FullName,
      Email: data.Email,
      Phone: data.Phone,
      ProfileImage: profileImage
    };
    
    try {
      const result = await UsersService.UpdateUser(userData);
      
      if (result.success) {
        setSaveStatus("success");
        setIsEditing(false);
        setToast({
          isVisible: true,
          type: "success",
          title: "SUCCESS",
          message: result.message as string,
          onClose() {
            setToast(null);
          },
        });

        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      setToast({
        isVisible: true,
        type: 'error',
        title: 'ERROR',
        message: 'An error occurred while updating profile.',
        onClose() {
          setToast(null);
        },
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({
        isVisible: true,
        type: 'warning',
        title: 'INVALID FILE',
        message: 'Upload only image files.',
        onClose() {
          setToast(null);
        }
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "allapps");
      formData.append("cloud_name", "dakyiye2e");

      const res = await fetch("https://api.cloudinary.com/v1_1/dakyiye2e/image/upload", {
        method: "POST",
        body: formData,
      }).then(r => r.json());

      if (res.secure_url) {
        setToast({
          isVisible: true,
          type: "success",
          title: "UPLOAD SUCCESSFUL",
          message: "Profile image uploaded successfully.",
          onClose() {
            setToast(null);
          },
        });

        try {
          const result = await UsersService.UpdateUserProfileImage(res.secure_url);
          if (result.success) {
            setToast({
              isVisible: true,
              type: "success",
              title: "SUCCESS",
              message: result.message as string,
              onClose() {
                setToast(null);
              },
            });
          } else {
            setToast({
              isVisible: true,
              type: "warning",
              title: result.error as string,
              message: result.message as string,
              onClose() {
                setToast(null);
              },
            });
          }
        } catch (error: any) {
          setToast({
            isVisible: true,
            type: "error",
            title: error?.response?.data?.error as string || "ERROR",
            message: error?.response?.data?.message || "An error occurred while updating profile image.",
            onClose() {
              setToast(null);
            },
          });
        }

        setProfileImage(res.secure_url as string);
      }
      
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setToast({
        isVisible: true,
        type: "error",
        title: "SERVER ERROR",
        message: "Failed to upload image. Please try again.",
        onClose() {
          setToast(null);
        },
      });
    }
  };

  const removeProfileImage = () => {
    setProfileImage(undefined);
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
    setSaveStatus('idle');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      {toast && <Toast {...toast} />}
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["profile-avatar-section"]}>
            <div className={styles["avatar-container"]}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className={styles.avatar}
                />
              ) : (
                <div className={styles["avatar-placeholder"]}>
                  <User size={40} />
                </div>
              )}

              {isUploading && (
                <div className={styles["upload-overlay"]}>
                  <div className={styles.spinner}></div>
                </div>
              )}

              {isEditing && (
                <div className={styles["avatar-actions"]}>
                  <label className={styles["upload-btn"]}>
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                  </label>
                  {profileImage && (
                    <button
                      className={styles["remove-btn"]}
                      onClick={removeProfileImage}
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={styles["profile-info"]}>
              <h1 className={styles["profile-name"]}>{user?.FullName ?? ''}</h1>
              <p className={styles["profile-role"]}>{(user as any)?.Role ?? ''}</p>
              <p className={styles["profile-joined"]}>
                Member since {formatDate((user as any)?.CreatedAt)}
              </p>
            </div>
          </div>

          <div className={styles["header-actions"]}>
            {!isEditing ? (
              <button
                className={styles["edit-btn"]}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className={styles["edit-actions"]}>
                <button
                  className={styles["cancel-btn"]}
                  onClick={cancelEdit}
                  type="button"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  className={styles["save-btn"]}
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty || !isValid || saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <div className={styles.spinner}></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {saveStatus !== "idle" && (
          <div className={`${styles["status-banner"]} ${styles[saveStatus]}`}>
            {saveStatus === "success" && (
              <>
                <CheckCircle size={18} />
                Profile updated successfully!
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle size={18} />
                Failed to update profile. Please try again.
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "personal" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("personal")}
          type="button"
        >
          <User size={18} />
          Personal Info
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "security" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("security")}
          type="button"
        >
          <Shield size={18} />
          Security
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "preferences" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("preferences")}
          type="button"
        >
          <Settings size={18} />
          Preferences
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        {activeTab === "personal" && (
          <div className={styles["tab-content"]}>
            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Basic Information</h2>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label className={styles.label}>
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    {...register("FullName", validationRules.FullName)}
                    className={`${styles.input} ${
                      errors.FullName ? styles.error : ""
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  {errors.FullName && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.FullName.message}
                    </span>
                  )}
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>
                    <Mail size={16} />
                    Email Address *
                  </label>
                  <input
                    {...register("Email", validationRules.Email)}
                    type="email"
                    className={`${styles.input} ${
                      errors.Email ? styles.error : ""
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                  {errors.Email && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.Email.message}
                    </span>
                  )}
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    {...register("Phone", validationRules.Phone)}
                    type="tel"
                    className={`${styles.input} ${
                      errors.Phone ? styles.error : ""
                    }`}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                  {errors.Phone && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.Phone.message}
                    </span>
                  )}
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    {...register("DateOfBirth")}
                    type="date"
                    className={styles.input}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Location</h2>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group-full"]}>
                  <label className={styles.label}>
                    <MapPin size={16} />
                    Address
                  </label>
                  <input
                    {...register("Address")}
                    className={styles.input}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>City</label>
                  <input
                    {...register("City")}
                    className={styles.input}
                    disabled={!isEditing}
                    placeholder="Enter your city"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>Country</label>
                  <input
                    {...register("Country")}
                    className={styles.input}
                    disabled={!isEditing}
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>About</h2>

              <div className={styles["form-group-full"]}>
                <label className={styles.label}>Bio</label>
                <textarea
                  {...register("Bio")}
                  className={styles.textarea}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className={styles["tab-content"]}>
            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Change Password</h2>

              <div className={styles["form-grid"]}>
                <div className={styles["form-group"]}>
                  <label className={styles.label}>Current Password</label>
                  <div className={styles["password-field"]}>
                    <input
                      {...register(
                        "CurrentPassword",
                        validationRules.CurrentPassword
                      )}
                      type={showPassword ? "text" : "password"}
                      className={`${styles.input} ${
                        errors.CurrentPassword ? styles.error : ""
                      }`}
                      disabled={!isEditing}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className={styles["password-toggle"]}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.CurrentPassword && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.CurrentPassword.message}
                    </span>
                  )}
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>New Password</label>
                  <div className={styles["password-field"]}>
                    <input
                      {...register("NewPassword", validationRules.NewPassword)}
                      type={showNewPassword ? "text" : "password"}
                      className={`${styles.input} ${
                        errors.NewPassword ? styles.error : ""
                      }`}
                      disabled={!isEditing}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className={styles["password-toggle"]}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.NewPassword && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.NewPassword.message}
                    </span>
                  )}
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input
                    {...register(
                      "ConfirmPassword",
                      validationRules.ConfirmPassword
                    )}
                    type="password"
                    className={`${styles.input} ${
                      errors.ConfirmPassword ? styles.error : ""
                    }`}
                    disabled={!isEditing}
                    placeholder="Confirm new password"
                  />
                  {errors.ConfirmPassword && (
                    <span className={styles["error-message"]}>
                      <AlertCircle size={14} />
                      {errors.ConfirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Security Settings</h2>

              <div className={styles["toggle-group"]}>
                <div className={styles["toggle-item"]}>
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className={styles["toggle-switch"]}>
                    <input
                      {...register("TwoFactorEnabled")}
                      type="checkbox"
                      disabled={!isEditing}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className={styles["tab-content"]}>
            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Notifications</h2>

              <div className={styles["toggle-group"]}>
                <div className={styles["toggle-item"]}>
                  <div>
                    <h3>Push Notifications</h3>
                    <p>
                      Receive notifications about your orders and reservations
                    </p>
                  </div>
                  <label className={styles["toggle-switch"]}>
                    <input
                      {...register("NotificationsEnabled")}
                      type="checkbox"
                      disabled={!isEditing}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles["toggle-item"]}>
                  <div>
                    <h3>Marketing Emails</h3>
                    <p>Receive updates about new dishes and special offers</p>
                  </div>
                  <label className={styles["toggle-switch"]}>
                    <input
                      {...register("MarketingEmails")}
                      type="checkbox"
                      disabled={!isEditing}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles["form-section"]}>
              <h2 className={styles["section-title"]}>Account Actions</h2>

              <div className={styles["action-buttons"]}>
                <button type="button" className={styles["danger-btn"]}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};