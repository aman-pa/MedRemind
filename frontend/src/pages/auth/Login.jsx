import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "../../lib/validation/zodResolver";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../lib/validation/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFormWrapper from "../../components/auth/AuthFormWrapper";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const user = await login({ email: data.email, password: data.password });
      const redirectTo = location.state?.from?.pathname;
      const isDoctor = user?.role?.toLowerCase() === "doctor";
      const destination = redirectTo || (isDoctor ? "/doctor" : "/patient");
      navigate(destination, { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid email or password.");
    }
  };

  const handleGoogleLogin = async (token) => {
    setApiError("");
    try {
      const user = await googleLogin({ token });
      const redirectTo = location.state?.from?.pathname;
      const destination = redirectTo || (user.role === "doctor" ? "/doctor" : "/patient");
      navigate(destination, { replace: true });
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      if (errorMsg === "Role is required for new users signing up with Google.") {
        navigate("/register", { 
          state: { message: "Looks like you're new! Please select a role (Patient or Doctor) to complete your Google registration." } 
        });
      } else {
        setApiError(errorMsg || "Google Login failed.");
      }
    }
  };

  return (
    <AuthLayout>
      <AuthFormWrapper
        title="Welcome back"
        subtitle="Log in to manage your medications and reminders."
        showGoogle
        onGoogleLogin={handleGoogleLogin}
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Register
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
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            registration={register("password")}
          />

          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="font-medium text-[var(--primary)] transition-colors duration-200 hover:text-[var(--primary-hover)] hover:underline underline-offset-2">
              Forgot password?
            </Link>
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-[var(--danger)]">
              {apiError}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting}>
            Log In
          </Button>
        </form>
      </AuthFormWrapper>
    </AuthLayout>
  );
};