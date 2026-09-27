import React from "react";
import Layout from "./../../components/Layout/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, LockKeyhole, Trophy, Eye, EyeOff } from "lucide-react";
import "./ForgotPassword.css";
//this our own css so we have imported it.

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  //form handle function to evolve each time refresh behavior of form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 7) {
      toast.error("Password must be at least 7 characters long.");
      return;
    }

    if (newPassword.length > 30) {
      toast.error("Password cannot exceed 30 characters.");
      return;
    }
    // console.log(name,email,password,phone,address);
    try {
      const res = await axios.post(
        // `${process.env.REACT_APP_API}/api/v1/auth/register`, we will use env later as we have already added proxy
        "/api/v1/auth/forgot-password",
        {
          email,
          newPassword,
          answer,
        },
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
        //it will check if we were in some page so it will navigate to that page after login
        //otherwise move to home page.
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
  <Layout title={"Forgot Password - Ecommerce App"}>
    <div className="forgot-page">
      <div className="forgot-wrapper">

        {/* =====================================================
            LEFT SHOWCASE
            ===================================================== */}
        <div className="forgot-showcase">
          <div className="forgot-showcase-overlay"></div>

          <div className="forgot-showcase-content">

            <div className="forgot-brand-badge">
              <span className="forgot-brand-dot"></span>
              Ecommerce App
            </div>

            <h1>
              Secure Your
              <br />
              <span>Account</span>
            </h1>

            <p className="forgot-showcase-text">
              Don't worry if you've forgotten your password.
              Verify your account details and create a new
              secure password.
            </p>

            <div className="forgot-benefits">

              <div className="forgot-benefit">
                <div className="forgot-benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>Secure Recovery</strong>
                  <span>
                    Safely recover access to your account.
                  </span>
                </div>
              </div>

              <div className="forgot-benefit">
                <div className="forgot-benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>Account Verification</strong>
                  <span>
                    Your registered details help verify you.
                  </span>
                </div>
              </div>

              <div className="forgot-benefit">
                <div className="forgot-benefit-icon">
                  ✓
                </div>

                <div>
                  <strong>Create New Password</strong>
                  <span>
                    Set a strong password for your account.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>


        {/* =====================================================
            RIGHT FORM
            ===================================================== */}
        <div className="forgot-form-side">

          <div className="forgot-card">

            <div className="forgot-header">
              <h2>Reset Password</h2>

              <p>
                Enter your details to reset your password
              </p>
            </div>


            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="forgot-field">

                <label htmlFor="forgot-email">
                  Email Address
                </label>

                <div className="forgot-input-wrapper">

                  <Mail
                    className="forgot-input-icon"
                    size={18}
                  />

                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* SECURITY ANSWER */}
              <div className="forgot-field">

                <label htmlFor="forgot-answer">
                  Favourite Sport
                </label>

                <div className="forgot-input-wrapper">

                  <Trophy
                    className="forgot-input-icon"
                    size={18}
                  />

                  <input
                    type="text"
                    id="forgot-answer"
                    value={answer}
                    onChange={(e) =>
                      setAnswer(e.target.value)
                    }
                    placeholder="Enter your favourite sport"
                    required
                  />

                </div>

              </div>


              {/* NEW PASSWORD */}
              <div className="forgot-field">

                <label htmlFor="forgot-password">
                  New Password
                </label>

                <div className="forgot-input-wrapper">

                  <LockKeyhole
                    className="forgot-input-icon"
                    size={18}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    id="forgot-password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    minLength={7}
                    maxLength={30}
                    required
                  />

                  <button
                    type="button"
                    className="forgot-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <small className="forgot-password-hint">
                  Password must be 7–30 characters long.
                </small>

              </div>


              {/* SUBMIT */}
              <button
                type="submit"
                className="forgot-submit"
              >
                RESET PASSWORD
              </button>

            </form>


            {/* FOOTER */}
            <div className="forgot-footer">

              <span>Remember your password?</span>

              <button
                type="button"
                className="forgot-login-link"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  </Layout>
);
};
export default ForgotPassword;
