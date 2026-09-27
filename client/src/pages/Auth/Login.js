import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useTheme } from "../../context/themeContext";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [auth, setAuth] = useAuth();
  const [theme] = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res?.data?.success) {
        toast.success(res?.data?.message);

        setAuth({
          ...auth,
          user: res?.data?.user,
          token: res?.data?.token,
        });

        localStorage.setItem("auth", JSON.stringify(res?.data));

        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Please check your email and password and try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="login-wrapper">

          {/* ================= LEFT SIDE ================= */}
          <div className="login-showcase">
            <div className="showcase-overlay"></div>

            <div className="showcase-content">
              <div className="brand-badge">
                <span className="brand-dot"></span>
                Ecommerce App
              </div>

              <h1>
                Welcome
                <br />
                <span>back.</span>
              </h1>

              <p>
                Discover a smarter way to shop. Sign in to continue your
                journey and access your personalized shopping experience.
              </p>

              <div className="showcase-features">
                <div className="showcase-feature">
                  <div className="feature-icon">
                    <ShieldCheck size={19} />
                  </div>
                  <div>
                    <strong>Secure Shopping</strong>
                    <span>Your account is protected</span>
                  </div>
                </div>

                <div className="showcase-feature">
                  <div className="feature-icon">
                    <LockKeyhole size={19} />
                  </div>
                  <div>
                    <strong>Private & Secure</strong>
                    <span>Your information stays protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LOGIN SIDE ================= */}
          <div className="login-form-side">
            <div className="login-card">

              <div className="mobile-brand">
                <div className="mobile-brand-icon">Y</div>
                <span>YourStore</span>
              </div>

              <div className="login-header">
                <span className="login-eyebrow">WELCOME BACK</span>
                <h2>Sign in to your account</h2>
                <p>
                  Enter your details below to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className="login-field">
                  <label htmlFor="login-email">Email Address</label>

                  <div className="input-wrapper">
                    <Mail className="input-icon" size={19} />

                    <input
                      type="email"
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="login-field">
                  <div className="password-label-row">
                    <label htmlFor="login-password">Password</label>

                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="input-wrapper">
                    <LockKeyhole className="input-icon" size={19} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="login-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span className="login-arrow">→</span>
                    </>
                  )}
                </button>

              </form>

              <div className="login-divider">
                <span>Secure authentication</span>
              </div>

              <p className="login-footer-text">
                By signing in, you agree to our terms and privacy policy.
              </p>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Login;