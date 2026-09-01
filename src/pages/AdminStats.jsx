import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, LogOut, Save, ShieldCheck } from "lucide-react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Seo from "../components/Seo";
import { auth, db, isFirebaseConfigured } from "../lib/firebase";
import { getSiteStats, updateSiteStats } from "../services/siteStats";

const initialLogin = { email: "", password: "" };

function getFriendlyError(error, fallback) {
  const message = error?.message?.toLowerCase() || "";

  if (
    message.includes("auth/invalid-credential") ||
    message.includes("auth/wrong-password") ||
    message.includes("auth/user-not-found")
  ) {
    return "The email or password is incorrect.";
  }

  if (message.includes("auth/too-many-requests")) {
    return "Too many sign-in attempts. Please wait a moment and try again.";
  }

  if (message.includes("auth/user-disabled")) {
    return "This account has been disabled.";
  }

  if (message.includes("auth/network-request-failed")) {
    return "Check your internet connection and try again.";
  }

  if (message.includes("permission-denied")) {
    return "Your account does not have permission to update the statistics.";
  }

  if (message.includes("email not verified")) {
    return "Please confirm your email before signing in.";
  }

  return fallback;
}

function AdminStats() {
  const [login, setLogin] = useState(initialLogin);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const loadAdminData = useCallback(async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      setStats([]);
      return;
    }

    const membership = await getDoc(doc(db, "site_admins", currentUser.uid));
    const hasAccess = membership.exists();
    setIsAdmin(hasAccess);

    if (hasAccess) {
      setStats(await getSiteStats());
    } else {
      setStats([]);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined;
    }

    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!isActive) return;
        setUser(currentUser);
        await loadAdminData(currentUser);
      } catch (error) {
        if (isActive) {
          setMessage({
            type: "error",
            text: getFriendlyError(error, "We could not validate your session."),
          });
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [loadAdminData]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        login.email.trim(),
        login.password
      );

      setUser(credential.user);
      await loadAdminData(credential.user);
      setLogin(initialLogin);
    } catch (error) {
      setMessage({
        type: "error",
        text: getFriendlyError(error, "We could not sign you in."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setStats([]);
    setMessage(null);
    setIsSubmitting(false);
  };

  const handleFieldChange = (id, field, value) => {
    setStats((current) =>
      current.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat))
    );
    setMessage(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (stats.some(({ value, label }) => !value.trim() || !label.trim())) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const updatedStats = await updateSiteStats(stats);
      setStats(updatedStats);
      setMessage({
        type: "success",
        text: "The statistics were updated successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: getFriendlyError(error, "We could not save your changes."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Statistics Dashboard"
        description="Private dashboard for managing the website statistics."
        path="/admin"
        noIndex
      />

      <section className="section admin-page">
        <div className="container admin-page__container">
          <div className="admin-card">
            <div className="admin-card__heading">
              <span className="admin-card__icon" aria-hidden="true">
                <ShieldCheck size={24} />
              </span>
              <div>
                <p className="admin-card__eyebrow">Private area</p>
                <h1>Website statistics</h1>
                <p>
                  Sign in to update the figures displayed on the home page.
                </p>
              </div>
            </div>

            {!isFirebaseConfigured && (
              <div className="admin-message admin-message--error" role="alert">
                The Firebase connection has not been configured. See the README
                to complete the setup.
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
              <p className="admin-loading" role="status">Verifying access…</p>
            ) : !user ? (
              <form className="admin-form" onSubmit={handleLogin}>
                <label>
                  Email address
                  <input
                    autoComplete="email"
                    inputMode="email"
                    name="email"
                    onChange={(event) =>
                      setLogin((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={login.email}
                  />
                </label>

                <label>
                  Password
                  <input
                    autoComplete="current-password"
                    minLength="8"
                    name="password"
                    onChange={(event) =>
                      setLogin((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Your password"
                    required
                    type="password"
                    value={login.password}
                  />
                </label>

                <button
                  className="btn btn-primary admin-form__submit"
                  disabled={isSubmitting || !isFirebaseConfigured}
                  type="submit"
                >
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </button>

                <div className="admin-form__links">
                  <Link to="/admin/forgot-password">Forgot your password?</Link>
                  <Link to="/">Return to the website</Link>
                </div>
              </form>
            ) : !isAdmin ? (
              <div className="admin-access-denied">
                <h2>This account does not have access</h2>
                <p>
                  You are signed in as <strong>{user.email}</strong>, but this
                  account is not authorized to edit the website.
                </p>
                <button
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            ) : (
              <form className="admin-editor" onSubmit={handleSave}>
                <div className="admin-editor__bar">
                  <p>Signed in as <strong>{user.email}</strong></p>
                  <button
                    className="admin-editor__logout"
                    disabled={isSubmitting}
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>

                <div className="admin-editor__grid">
                  {stats.map((stat) => (
                    <fieldset className="admin-stat" key={stat.id}>
                      <legend>Statistic {stat.sort_order}</legend>
                      <label>
                        Value
                        <input
                          maxLength="30"
                          onChange={(event) =>
                            handleFieldChange(stat.id, "value", event.target.value)
                          }
                          required
                          value={stat.value}
                        />
                      </label>
                      <label>
                        Label
                        <input
                          maxLength="80"
                          onChange={(event) =>
                            handleFieldChange(stat.id, "label", event.target.value)
                          }
                          required
                          value={stat.label}
                        />
                      </label>
                    </fieldset>
                  ))}
                </div>

                <div className="admin-editor__actions">
                  <Link className="btn btn-secondary" to="/#results">
                    View statistics
                  </Link>
                  <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <Save size={17} />
                    {isSubmitting ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminStats;
