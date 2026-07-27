import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { zodResolver } from "../../lib/validation/zodResolver";
import { registerSchema } from "../../lib/validation/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

export default function Register() {
  const { register: registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState(location.state?.message || "");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleLogin = async (token) => {
    setApiError("");
    if (!selectedRole) {
      setApiError("Please select a role (Patient or Doctor) before continuing with Google.");
      return;
    }
    
    try {
      const user = await googleLogin({ token, role: selectedRole });
      const destination = user.role === "doctor" ? "/doctor" : "/patient";
      navigate(destination, { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.message || "Google Signup failed.");
    }
  };

  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Create your account"
        subtitle="Start managing medications the smart way."
        showGoogle
        onGoogleLogin={handleGoogleLogin}
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Log in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            id="name"
            label="Full name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            registration={register("name")}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={register("email")}
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            registration={register("password")}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          <div>
            <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)] has-[:checked]:border-[var(--primary)] has-[:checked]:text-[var(--primary)] has-[:checked]:bg-[var(--primary-light)]">
              <input type="radio" value="patient" {...register("role")} className="sr-only" />
                Patient
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)] has-[:checked]:border-[var(--primary)] has-[:checked]:text-[var(--primary)] has-[:checked]:bg-[var(--primary-light)]">
                <input type="radio" value="doctor" {...register("role")} className="sr-only" />
                 Doctor
                </label>
            </div>


            {errors.role && (
              <p role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
                {errors.role.message}
              </p>
            )}
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {apiError}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>
      </AuthFormWrapper>
    </AuthLayout>
  );
};