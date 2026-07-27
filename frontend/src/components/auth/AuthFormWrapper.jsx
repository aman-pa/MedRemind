import { GoogleLogin } from '@react-oauth/google';

export default function AuthFormWrapper({
  title,
  subtitle,
  showGoogle = false,
  onGoogleLogin,
  children,
  footer,
}) {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-[var(--text)]">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>}

      {showGoogle && (
        <>
          <div className="mt-6 flex w-full justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                onGoogleLogin && onGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                console.error('Google Login Failed');
              }}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="300"
            />
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)]">OR</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </>
      )}

      {children}

      {footer && <div className="mt-6 text-center text-sm text-[var(--text-muted)]">{footer}</div>}
    </div>
  );
}