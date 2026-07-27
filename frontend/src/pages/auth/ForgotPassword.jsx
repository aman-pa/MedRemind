import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/validation/zodResolver";
import { forgotPasswordSchema } from "../../lib/validation/authSchemas";
import { forgotPasswordRequest } from "../../services/auth.service";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ForgotPassword() {
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await forgotPasswordRequest(data.email);
      setSubmitted(true);
    } catch (error) {
      setApiError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <AuthFormWrapper
          title="Check your email"
          subtitle="If an account exists for that email, we've sent a link to reset your password."
          footer={
            <Link to="/login" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Back to login
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
      <AuthFormWrapper
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link."
        footer={
          <>
            Remembered it?{" "}
            <Link to="/login" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Back to login
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={register("email")}
          />

          {apiError && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {apiError}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      </AuthFormWrapper>
    </AuthLayout>
  );
}