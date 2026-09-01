import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, KeyRound } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import Seo from "../components/Seo";
import { auth, isFirebaseConfigured } from "../lib/firebase";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: new URL("/admin", window.location.origin).toString(),
      });

      setMessage({
        type: "success",
        text: "If an account exists for that email, a password reset link is on its way.",
      });
      setEmail("");
    } catch {
      setMessage({
        type: "error",
        text: "We could not send the reset email. Please wait a moment and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Forgot Password"
        description="Request a password reset for the private statistics dashboard."
        path="/admin/forgot-password"
        noIndex
      />

      <section className="section admin-page">
        <div className="container admin-page__container admin-page__container--narrow">
          <div className="admin-card">
            <div className="admin-card__heading">
              <span className="admin-card__icon" aria-hidden="true">
                <KeyRound size={24} />
              </span>
              <div>
                <h1>Forgot your password?</h1>
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

            <form className="admin-form" onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  autoComplete="email"
                  inputMode="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </label>

              <button
                className="btn btn-primary admin-form__submit"
                disabled={isSubmitting || !isFirebaseConfigured}
                type="submit"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </button>

              <div className="admin-form__links">
                <Link to="/admin">Back to sign in</Link>
                <Link to="/">Return to the website</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminForgotPassword;
