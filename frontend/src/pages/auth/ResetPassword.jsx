import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/validation/zodResolver";
import { resetPasswordSchema } from "../../lib/validation/authSchemas";
import { resetPasswordRequest } from "../../services/auth.service";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await resetPasswordRequest({ token, password: data.password });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (error) {
      setApiError(error.response?.data?.message || "This link is invalid or has expired.");
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Invalid reset link"
          subtitle="This password reset link is missing or malformed."
          footer={
            <Link to="/forgot-password" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Request a new link
            </Link>
          }
        >
          <div />
        </AuthFormWrapper>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthFormWrapper title="Set a new password" subtitle="Choose a strong password for your account.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <PasswordInput
            id="password"
            label="New password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            registration={register("password")}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm new password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          {apiError && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {apiError}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting}>
            Reset Password
          </Button>
        </form>
      </AuthFormWrapper>
    </AuthLayout>
  );
}