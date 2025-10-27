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
} from "lucide-react";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import Toast, { ToastProps } from "../components/Toast";
import { AuthService } from "../services/auth.service";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ toast, setToast ] = useState<ToastProps | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<LoginFormData>({
    mode: "all",
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    let response = await AuthService.Login({Email: data.email, Password: data.password});

    if(response.success) {
      setIsSubmitting(false);
      let toast: ToastProps = {
        isVisible: true,
        type: "success",
        title: "SUCCESS",
        message: response.message as string,
        onClose: () => setToast(() => null)
      }
      
      setToast(() => toast);

      setTimeout(() => {
        if(response.role === "admin") navigate("/admin");
        else navigate("/user");
      }, 6000);
    } else {
      setIsSubmitting(false);
      let toast: ToastProps = {
        isVisible: true,
        type: "error",
        title: response.error as string,
        message: response.message as string,
        onClose: () => setToast(() => null)
      }
      
      setToast(() => toast);
    }
  };

  const navigateHome = () => {
    navigate("/home");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles["login-page"]}>
      {toast === null ? <div></div> : <Toast {...toast}></Toast>}
      <div className={styles["login-background"]}>
        <div className={styles["login-overlay"]}></div>
      </div>

      <button className={styles["home-btn"]} onClick={navigateHome}>
        <Home size={20} />
        <span>Back to Home</span>
      </button>

      <div className={styles["login-container"]}>
        <div className={styles["login-card"]}>
          {/* Header */}
          <div className={styles["login-header"]}>
            <div className={styles["login-logo"]}>
              <h1>FancyTunes</h1>
            </div>
            <h2 className={styles["login-title"]}>Welcome Back</h2>
            <p className={styles["login-subtitle"]}>
              Sign in to your account to continue
            </p>
          </div>

          <div className={styles["login-form"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Email Address</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className={`${styles["form-input"]} ${
                    errors.email ? styles.error : ""
                  } ${
                    touchedFields.email && !errors.email ? styles.valid : ""
                  }`}
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                <div className={styles["validation-icon"]}>
                  {touchedFields.email && !errors.email && watchedEmail && (
                    <CheckCircle size={18} className={styles["success-icon"]} />
                  )}
                  {errors.email && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.email && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Password</label>
              <div className={styles["input-wrapper"]}>
                <div className={styles["input-icon"]}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${styles["form-input"]} ${
                    errors.password ? styles.error : ""
                  } ${
                    touchedFields.password && !errors.password
                      ? styles.valid
                      : ""
                  }`}
                  placeholder="Enter your password"
                  {...register("password", {
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
                  {touchedFields.password &&
                    !errors.password &&
                    watchedPassword && (
                      <CheckCircle
                        size={18}
                        className={styles["success-icon"]}
                      />
                    )}
                  {errors.password && (
                    <AlertCircle size={18} className={styles["error-icon"]} />
                  )}
                </div>
              </div>
              {errors.password && (
                <span className={styles["error-message"]}>
                  <AlertCircle size={14} />
                  {errors.password.message}
                </span>
              )}

              {watchedPassword && (
                <div className={styles["password-strength"]}>
                  <div className={styles["strength-bar"]}>
                    <div
                      className={`${styles["strength-fill"]} ${
                        watchedPassword.length >= 8 &&
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
                          watchedPassword
                        )
                          ? styles.strong
                          : watchedPassword.length >= 6
                          ? styles.medium
                          : styles.weak
                      }`}
                    ></div>
                  </div>
                  <span className={styles["strength-text"]}>
                    {watchedPassword.length >= 8 &&
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
                      watchedPassword
                    )
                      ? "Strong password"
                      : watchedPassword.length >= 6
                      ? "Medium strength"
                      : "Weak password"}
                  </span>
                </div>
              )}
            </div>

            <div className={styles["form-options"]}>
              <label className={styles["checkbox-wrapper"]}>
                <input
                  type="checkbox"
                  className={styles["checkbox-input"]}
                  {...register("rememberMe")}
                />
                <span className={styles["checkbox-custom"]}></span>
                <span className={styles["checkbox-label"]}>Remember me</span>
              </label>

              <a href="verify-mail" className={styles["forgot-password"]}>
                Forgot Password?
              </a>
            </div>

            <button
              type="button"
              className={`${styles["login-btn"]} ${
                !isValid ? styles.disabled : ""
              }`}
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

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

            {/* Sign up link */}
            <div className={styles["signup-link"]}>
              <span>Don't have an account? </span>
              <a href="register" className={styles["signup-btn"]}>
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
