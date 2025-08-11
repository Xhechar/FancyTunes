import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import "../styles/VerifyMail.css";

interface EmailFormData {
  email: string;
}

interface CodeFormData {
  verificationCode: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

type Step = "email" | "verification" | "password" | "success";

export const VerifyMail: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [userEmail, setUserEmail] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormData>({
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const codeForm = useForm<CodeFormData>({
    mode: "onChange",
    defaultValues: { verificationCode: "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Timer for resend code functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUserEmail(data.email);
      setCurrentStep("verification");
      setTimer(300); // 5 minutes
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const onCodeSubmit = async (data: CodeFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (data.verificationCode === "123456") {
        // Mock validation
        setCurrentStep("password");
      } else {
        codeForm.setError("verificationCode", {
          type: "manual",
          message: "Invalid verification code",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep("success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleResendCode = async () => {
    if (timer === 0) {
      setTimer(300);
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div
        className={`step ${
          currentStep === "email"
            ? "active"
            : "completed"
        }`}
      >
        <div className="step-circle">
          {currentStep === "email" ? (
            <Mail size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
        </div>
        <span>Email</span>
      </div>
      <div className="step-line"></div>
      <div
        className={`step ${
          currentStep === "verification"
            ? "active"
            : currentStep === "password" || currentStep === "success"
            ? "completed"
            : ""
        }`}
      >
        <div className="step-circle">
          {currentStep === "verification" ? (
            <KeyRound size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
        </div>
        <span>Verify</span>
      </div>
      <div className="step-line"></div>
      <div
        className={`step ${
          currentStep === "password"
            ? "active"
            : currentStep === "success"
            ? "completed"
            : ""
        }`}
      >
        <div className="step-circle">
          {currentStep === "password" ? (
            <Lock size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
        </div>
        <span>Reset</span>
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <form
      onSubmit={emailForm.handleSubmit(onEmailSubmit)}
      className="verification-form"
    >
      <div className="form-header">
        <div className="form-icon">
          <Mail size={24} />
        </div>
        <h2>Forgot Password?</h2>
        <p>
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-wrapper">
          <Mail className="input-icon" size={20} />
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            {...emailForm.register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className={emailForm.formState.errors.email ? "error" : ""}
          />
        </div>
        {emailForm.formState.errors.email && (
          <span className="error-message">
            <AlertCircle size={16} />
            {emailForm.formState.errors.email.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={
          emailForm.formState.isSubmitting || !emailForm.formState.isValid
        }
      >
        {emailForm.formState.isSubmitting ? (
          <div className="loading-spinner"></div>
        ) : (
          "Send Verification Code"
        )}
      </button>
    </form>
  );

  const renderVerificationStep = () => (
    <form
      onSubmit={codeForm.handleSubmit(onCodeSubmit)}
      className="verification-form"
    >
      <div className="form-header">
        <div className="form-icon">
          <KeyRound size={24} />
        </div>
        <h2>Enter Verification Code</h2>
        <p>
          We've sent a 6-digit verification code to <strong>{userEmail}</strong>
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="verificationCode">Verification Code</label>
        <div className="input-wrapper">
          <KeyRound className="input-icon" size={20} />
          <input
            type="text"
            id="verificationCode"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...codeForm.register("verificationCode", {
              required: "Verification code is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Please enter a valid 6-digit code",
              },
            })}
            className={
              codeForm.formState.errors.verificationCode ? "error" : ""
            }
          />
        </div>
        {codeForm.formState.errors.verificationCode && (
          <span className="error-message">
            <AlertCircle size={16} />
            {codeForm.formState.errors.verificationCode.message}
          </span>
        )}
      </div>

      <div className="timer-section">
        {timer > 0 ? (
          <div className="timer-display">
            <Clock size={16} />
            <span>Resend code in {formatTime(timer)}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            className="resend-btn"
          >
            Resend Code
          </button>
        )}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={
          codeForm.formState.isSubmitting || !codeForm.formState.isValid
        }
      >
        {codeForm.formState.isSubmitting ? (
          <div className="loading-spinner"></div>
        ) : (
          "Verify Code"
        )}
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    <form
      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
      className="verification-form"
    >
      <div className="form-header">
        <div className="form-icon">
          <Lock size={24} />
        </div>
        <h2>Set New Password</h2>
        <p>Create a strong password for your FancyTunes account.</p>
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter new password"
            {...passwordForm.register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            className={passwordForm.formState.errors.newPassword ? "error" : ""}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordForm.formState.errors.newPassword && (
          <span className="error-message">
            <AlertCircle size={16} />
            {passwordForm.formState.errors.newPassword.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm new password"
            {...passwordForm.register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordForm.watch("newPassword") ||
                "Passwords do not match",
            })}
            className={
              passwordForm.formState.errors.confirmPassword ? "error" : ""
            }
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordForm.formState.errors.confirmPassword && (
          <span className="error-message">
            <AlertCircle size={16} />
            {passwordForm.formState.errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={
          passwordForm.formState.isSubmitting || !passwordForm.formState.isValid
        }
      >
        {passwordForm.formState.isSubmitting ? (
          <div className="loading-spinner"></div>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="verification-form success-form">
      <div className="form-header">
        <div className="form-icon success">
          <CheckCircle size={24} />
        </div>
        <h2>Password Updated!</h2>
        <p>
          Your password has been successfully updated. You will be redirected to
          the login page shortly.
        </p>
      </div>

      <div className="success-animation">
        <div className="checkmark-circle">
          <CheckCircle size={48} />
        </div>
      </div>

      <button onClick={() => navigate("/login")} className="submit-btn">
        Go to Login
      </button>
    </div>
  );

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="brand-section">
          <h1 className="brand-name">FancyTunes</h1>
          <span className="brand-tagline">Premium Dining Experience</span>
        </div>

        {renderStepIndicator()}

        <div className="form-container">
          {currentStep === "email" && renderEmailStep()}
          {currentStep === "verification" && renderVerificationStep()}
          {currentStep === "password" && renderPasswordStep()}
          {currentStep === "success" && renderSuccessStep()}
        </div>
      </div>

      <div className="background-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};