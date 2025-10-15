import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Home,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Upload,
  X,
  Check,
} from "lucide-react";
import styles from "../styles/Register.module.css";
import { useNavigate } from "react-router-dom";
import { CreateUserDto } from "../interfaces/dtos/interfaces.dtos";
import Toast, { ToastProps } from "../components/Toast";
import { UsersService } from "../services/user.service";
import { title } from "process";

interface RegisterFormData {
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  confirmPassword: string;
  Role: string;
  ProfileImage?: FileList;
  agreeToTerms: boolean;
}

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [toast, setToast] = useState<ToastProps | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
    clearErrors,
  } = useForm<RegisterFormData>({
    mode: "all",
    defaultValues: {
      Role: "Customer",
    },
  });

  const watchedPassword = watch("Password");
  const watchedConfirmPassword = watch("confirmPassword");
  const watchedEmail = watch("Email");
  const watchedFullName = watch("FullName");
  const watchedPhone = watch("Phone");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    const userData: CreateUserDto = {
      FullName: data.FullName,
      Email: data.Email,
      Phone: data.Phone,
      ProfileImage: profileImagePreview || undefined,
      Password: data.Password,
    };

    let result = await UsersService.CreateUser(userData);

    if (result.success) {
      const toast : ToastProps = {
      isVisible: true,
      type: "success",
      title: "SUCCESS",
      message: result.message as string,
      onClose : () => setToast(() => null)
      };

      setToast(() => toast);

      setTimeout(() => {
        navigateToLogin();
      }, 6000);
    } else {
      const toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: result.error as string,
        message: result.message as string,
        onClose : () => setToast(() => null)
      };

      setToast(() => toast);
    }

    setIsSubmitting(false);
  };

  const navigateToPage = (page: string) => {
    navigate(`/${page}`);
  };

  const navigateHome = () => {
    navigate("/home");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        <Toast
          isVisible={true}
          type={"warning"}
          title={"IMAGE ERROR"}
          message={"only images less than 5mb can be submitted."}
          onClose={function (): void {}}
        ></Toast>;
        return;
      }

      if (!file.type.startsWith("image/")) {
        <Toast
          isVisible={true}
          type={"warning"}
          title={"IMAGE ERROR"}
          message={"please select a valid image file."}
          onClose={function (): void {}}
        ></Toast>;
        return;
      }

      const formData: FormData = new FormData();

      formData.append("file", file);
      formData.append("cloud_name", "dakyiye2e");
      formData.append("image_preset", "some_preset_name");

      fetch("https://api.cloudinary.com/v1_1/dakyiye2e/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.secure_url) {
            setProfileImagePreview(res.secure_url);
            <Toast
              isVisible={false}
              type={"success"}
              title={"SUCCESS"}
              message={"image uploaded successfully."}
              onClose={function (): void {}}
            ></Toast>;
          }
        });
    }
  };

  const removeProfileImage = () => {
    setProfileImagePreview(null);
    setValue("ProfileImage", undefined);
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return "none";

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;

    const score = [
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isLongEnough,
    ].filter(Boolean).length;

    if (score < 3) return "weak";
    if (score < 5) return "medium";
    return "strong";
  };

  const passwordsMatch =
    watchedPassword === watchedConfirmPassword && watchedConfirmPassword !== "";

  return (
    <div className={styles["register-page"]}>
      {
        toast ? <Toast { ...toast }></Toast> : <div></div>
      }
      {/* Background overlay */}
      <div className={styles["register-background"]}>
        <div className={styles["register-overlay"]}></div>
      </div>

      {/* Home button */}
      <button className={styles["home-btn"]} onClick={navigateHome}>
        <Home size={20} />
        <span>Back to Home</span>
      </button>

      {/* Register container */}
      <div className={styles["register-container"]}>
        <div className={styles["register-card"]}>
          {/* Header */}
          <div className={styles["register-header"]}>
            <div className={styles["register-logo"]}>
              <h1>FancyTunes</h1>
            </div>
            <h2 className={styles["register-title"]}>Create Account</h2>
            <p className={styles["register-subtitle"]}>
              Join FancyTunes for an exceptional dining experience
            </p>
          </div>

          {/* Registration Form */}
          <div className={styles["register-form"]}>
            {/* Profile Image Upload */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>
                Profile Picture (Optional)
              </label>
              <div className={styles["image-upload-wrapper"]}>
                {profileImagePreview ? (
                  <div className={styles["image-preview"]}>
                    <img src={profileImagePreview} alt="Profile preview" />
                    <button
                      type="button"
                      className={styles["remove-image"]}
                      onClick={removeProfileImage}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className={styles["image-upload-area"]}>
                    <Upload size={24} />
                    <span>Click to upload profile picture</span>
                    <small>JPG, PNG up to 5MB</small>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={styles["image-input"]}
                  {...register("ProfileImage", {
                    onChange: (e) => {
                      handleImageUpload(e);
                    },
                  })}
                />
              </div>
            </div>

            {/* Full Name Field */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Full Name</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className={`${styles["form-input"]} ${
                    errors.FullName ? styles.error : ""
                  } ${
                    touchedFields.FullName && !errors.FullName
                      ? styles.valid
                      : ""
                  }`}
                  placeholder="Enter your full name"
                  {...register("FullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Full name must not exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Full name can only contain letters and spaces",
                    },
                  })}
                />
                <div className={styles["validation-icon"]}>
                  {touchedFields.FullName &&
                    !errors.FullName &&
                    watchedFullName && (
                      <CheckCircle
                        size={18}
                        className={styles["success-icon"]}
                      />
                    )}
                  {errors.FullName && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.FullName && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.FullName.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Email Address</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className={`${styles["form-input"]} ${
                    errors.Email ? styles.error : ""
                  } ${
                    touchedFields.Email && !errors.Email ? styles.valid : ""
                  }`}
                  placeholder="Enter your email address"
                  {...register("Email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                <div className={styles["validation-icon"]}>
                  {touchedFields.Email && !errors.Email && watchedEmail && (
                    <CheckCircle size={18} className={styles["success-icon"]} />
                  )}
                  {errors.Email && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.Email && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.Email.message}
                </span>
              )}
            </div>

            {/* Phone Field */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Phone Number</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  className={`${styles["form-input"]} ${
                    errors.Phone ? styles.error : ""
                  } ${
                    touchedFields.Phone && !errors.Phone ? styles.valid : ""
                  }`}
                  placeholder="e.g., +254700123456"
                  {...register("Phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^(\+254|0)[17]\d{8}$/,
                      message: "Please enter a valid Kenyan phone number",
                    },
                  })}
                />
                <div className={styles["validation-icon"]}>
                  {touchedFields.Phone && !errors.Phone && watchedPhone && (
                    <CheckCircle size={18} className={styles["success-icon"]} />
                  )}
                  {errors.Phone && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.Phone && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.Phone.message}
                </span>
              )}
            </div>

            {/* Role Selection */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Account Type</label>
              <div className={styles["role-selection"]}>
                <label className={styles["role-option"]}>
                  <input
                    type="radio"
                    value="Customer"
                    {...register("Role", {
                      required: "Please select an account type",
                    })}
                  />
                  <span className={styles["role-custom"]}></span>
                  <div className={styles["role-content"]}>
                    <span className={styles["role-title"]}>Customer</span>
                    <span className={styles["role-description"]}>
                      Book rooms and order delicacies
                    </span>
                  </div>
                </label>
                <label className={styles["role-option"]}>
                  <input
                    type="radio"
                    value="Business"
                    {...register("Role", {
                      required: "Please select an account type",
                    })}
                  />
                  <span className={styles["role-custom"]}></span>
                  <div className={styles["role-content"]}>
                    <span className={styles["role-title"]}>Business</span>
                    <span className={styles["role-description"]}>
                      Corporate bookings and events
                    </span>
                  </div>
                </label>
              </div>
              {errors.Role && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.Role.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Password</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${styles["form-input"]} ${
                    errors.Password ? styles.error : ""
                  } ${
                    touchedFields.Password && !errors.Password
                      ? styles.valid
                      : ""
                  }`}
                  placeholder="Create a strong password"
                  {...register("Password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message:
                        "Password must contain uppercase, lowercase, number and special character",
                    },
                  })}
                />
                <button
                  type="button"
                  className={styles["password-toggle"]}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <div className={styles["validation-icon"]}>
                  {touchedFields.Password &&
                    !errors.Password &&
                    watchedPassword && (
                      <CheckCircle
                        size={18}
                        className={styles["success-icon"]}
                      />
                    )}
                  {errors.Password && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.Password && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.Password.message}
                </span>
              )}

              {/* Password strength indicator */}
              {watchedPassword && (
                <div className={styles["password-strength"]}>
                  <div className={styles["strength-bar"]}>
                    <div
                      className={`${styles["strength-fill"]} ${
                        styles[getPasswordStrength(watchedPassword)]
                      }`}
                    ></div>
                  </div>
                  <span className={styles["strength-text"]}>
                    {getPasswordStrength(watchedPassword) === "strong" &&
                      "Strong password"}
                    {getPasswordStrength(watchedPassword) === "medium" &&
                      "Medium strength"}
                    {getPasswordStrength(watchedPassword) === "weak" &&
                      "Weak password"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Confirm Password</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${styles["form-input"]} ${
                    errors.confirmPassword ? styles.error : ""
                  } ${passwordsMatch ? styles.valid : ""}`}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      if (value !== watchedPassword) {
                        return "Passwords do not match";
                      }
                    },
                  })}
                />
                <button
                  type="button"
                  className={styles["password-toggle"]}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                <div className={styles["validation-icon"]}>
                  {passwordsMatch && (
                    <CheckCircle size={18} className={styles["success-icon"]} />
                  )}
                  {errors.confirmPassword && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className={styles["form-group"]}>
              <label className={styles["checkbox-wrapper"]}>
                <input
                  type="checkbox"
                  className={styles["checkbox-input"]}
                  {...register("agreeToTerms", {
                    required: "You must agree to the terms and conditions",
                  })}
                />
                <span className={styles["checkbox-custom"]}></span>
                <span className={styles["checkbox-label"]}>
                  I agree to the{" "}
                  <a href="#" className={styles["terms-link"]}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className={styles["terms-link"]}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.agreeToTerms.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className={`${styles["register-btn"]} ${
                !isValid ? styles.disabled : ""
              }`}
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <>
                  <div className={styles["spinner"]}></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className={styles["divider"]}>
              <span>or sign up with</span>
            </div>

            {/* Social Registration */}
            <div className={styles["social-login"]}>
              <button
                type="button"
                className={`${styles["social-btn"]} ${styles.google}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className={`${styles["social-btn"]} ${styles.facebook}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Login link */}
            <div className={styles["login-link"]}>
              <span>Already have an account? </span>
              <button
                type="button"
                className={styles["login-btn-link"]}
                onClick={() => navigateToPage("login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
