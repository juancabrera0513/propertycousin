import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import Seo from "../components/Seo";
import { auth, isFirebaseConfigured } from "../lib/firebase";

function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [resetCode] = useState(
    () => new URLSearchParams(window.location.search).get("oobCode") || ""
  );
  const [hasValidResetCode, setHasValidResetCode] = useState(false);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;

    let isActive = true;

    const checkResetCode = async () => {
      try {
        if (!resetCode) throw new Error("Missing reset code.");
        await verifyPasswordResetCode(auth, resetCode);
        if (isActive) setHasValidResetCode(true);
      } catch {
        if (isActive) setHasValidResetCode(false);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    checkResetCode();

    return () => {
      isActive = false;
    };
  }, [resetCode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 12) {
      setMessage({
        type: "error",
        text: "Use at least 12 characters for your new password.",
      });
      return;
    }

    if (password !== confirmation) {
      setMessage({ type: "error", text: "The passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmPasswordReset(auth, resetCode, password);
      setPassword("");
      setConfirmation("");
      setIsComplete(true);
      setMessage({
        type: "success",
        text: "Your password has been updated. You can now sign in.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "We could not update your password. Request a new reset link and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Choose a New Password"
        description="Choose a new password for the private statistics dashboard."
        path="/admin/reset-password"
        noIndex
      />

      <section className="section admin-page">
        <div className="container admin-page__container admin-page__container--narrow">
          <div className="admin-card">
            <div className="admin-card__heading">
              <span className="admin-card__icon" aria-hidden="true">
                <LockKeyhole size={24} />
              </span>
              <div>
                <p className="admin-card__eyebrow">Secure account</p>
                <h1>Choose a new password</h1>
                <p>
                  Create a strong password you do not use for any other account.
                </p>
              </div>
            </div>

            {!isFirebaseConfigured && (
              <div className="admin-message admin-message--error" role="alert">
                The Firebase connection has not been configured.
              </div>
            )}

            {message && (
              <div
                className={`admin-message admin-message--${message.type}`}
                role={message.type === "error" ? "alert" : "status"}
              >
                {message.type === "success" && <CheckCircle2 size={18} />}
                {message.text}
              </div>
            )}

            {isLoading ? (
              <p className="admin-loading" role="status">Checking reset link…</p>
            ) : isComplete ? (
              <div className="admin-success-panel">
                <Link className="btn btn-primary" to="/admin">
                  Continue to sign in
                </Link>
              </div>
            ) : hasValidResetCode ? (
              <form className="admin-form" onSubmit={handleSubmit}>
                <label>
                  New password
                  <input
                    autoComplete="new-password"
                    minLength="12"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 12 characters"
                    required
                    type="password"
                    value={password}
                  />
                </label>

                <label>
                  Confirm new password
                  <input
                    autoComplete="new-password"
                    minLength="12"
                    onChange={(event) => setConfirmation(event.target.value)}
                    placeholder="Enter the password again"
                    required
                    type="password"
                    value={confirmation}
                  />
                </label>

                <button
                  className="btn btn-primary admin-form__submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Updating…" : "Update password"}
                </button>
              </form>
            ) : (
              <div className="admin-access-denied">
                <h2>This reset link is invalid or has expired</h2>
                <p>Request a new password reset email to continue.</p>
                <Link className="btn btn-secondary" to="/admin/forgot-password">
                  Request another link
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminResetPassword;
