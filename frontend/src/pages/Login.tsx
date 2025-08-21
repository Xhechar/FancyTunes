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
import styles from "../styles/Login.module.css"; // CSS Module import
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    try {
      console.log("Login data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
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
      {/* Background overlay */}
      <div className={styles["login-background"]}>
        <div className={styles["login-overlay"]}></div>
      </div>

      {/* Home button */}
      <button className={styles["home-btn"]} onClick={navigateHome}>
        <Home size={20} />
        <span>Back to Home</span>
      </button>

      {/* Login container */}
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

          {/* Login Form */}
          <div className={styles["login-form"]}>
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

              {/* Password strength indicator */}
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

            {/* Remember Me & Forgot Password */}
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

            {/* Submit Button */}
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

            {/* Divider */}
            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            {/* Social Login */}
            <div className={styles["social-login"]}>
              <button
                type="button"
                className={`${styles["social-btn"]} ${styles.google}`}
              >
                {/* Google SVG */}
                Google
              </button>

              <button
                type="button"
                className={`${styles["social-btn"]} ${styles.facebook}`}
              >
                {/* Facebook SVG */}
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
