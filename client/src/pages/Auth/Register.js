import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
//here we have removed ",{Toaster}" no need of it
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  Trophy,
  Eye,
  EyeOff,
} from "lucide-react";
import "./Register.css";
//this our own css so we have imported it.

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  //form handle function to evolve each time refresh behavior of form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 7) {
      toast.error("Password must be at least 7 characters long.");
      return;
    }

    if (password.length > 30) {
      toast.error("Password cannot exceed 30 characters.");
      return;
    }

    if (name.length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return;
    }
    // console.log(name,email,password,phone,address);
    try {
      const res = await axios.post(
        // `${process.env.REACT_APP_API}/api/v1/auth/register`, we will use env later as we have already added proxy
        "/api/v1/auth/register",
        { name, email, password, phone, address, answer },
      );
      ///api/v1/auth/register this path is added from server.js
      //and register is API from authRoute.js
      if (res && res?.data?.success) {
        toast.success(res && res?.data?.message);
        navigate("/login");
      } else {
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Register - Ecommerce App"}>
      <div className="register-page">
        <div className="register-wrapper">
          {/* =====================================================
            LEFT SHOWCASE
            ===================================================== */}
          <div className="register-showcase">
            <div className="register-showcase-overlay"></div>

            <div className="register-showcase-content">
              <div className="register-brand-badge">
                <span className="register-brand-dot"></span>
                Ecommerce App
              </div>

              <h1>
                Join Our
                <br />
                <span>Community</span>
              </h1>

              <p className="register-showcase-text">
                Create your account and enjoy a simple, secure, and convenient
                shopping experience.
              </p>

              <div className="register-benefits">
                <div className="register-benefit">
                  <div className="register-benefit-icon">✓</div>
                  <div>
                    <strong>Easy Shopping</strong>
                    <span>Browse and shop with ease.</span>
                  </div>
                </div>

                <div className="register-benefit">
                  <div className="register-benefit-icon">✓</div>
                  <div>
                    <strong>Secure Account</strong>
                    <span>Your account stays protected.</span>
                  </div>
                </div>

                <div className="register-benefit">
                  <div className="register-benefit-icon">✓</div>
                  <div>
                    <strong>Track Your Orders</strong>
                    <span>Keep track of your purchases.</span>
                  </div>
                </div>
                <div className="register-benefit">
                  <div className="register-benefit-icon">✓</div>
                  <div>
                    <strong>Auto Invoice Generation</strong>
                    <span>Track Invoice Aligned with Your Order.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
            RIGHT REGISTER FORM
            ===================================================== */}
          <div className="register-form-side">
            <div className="register-card">
              <div className="register-header">
                <h2>Create Account</h2>
                <p>Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="register-field">
                  <label htmlFor="register-name">Full Name</label>

                  <div className="register-input-wrapper">
                    <UserRound className="register-input-icon" size={18} />

                    <input
                      type="text"
                      id="register-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="register-field">
                  <label htmlFor="register-email">Email Address</label>

                  <div className="register-input-wrapper">
                    <Mail className="register-input-icon" size={18} />

                    <input
                      type="email"
                      id="register-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="register-field">
                  <label htmlFor="register-password">Password</label>

                  <div className="register-input-wrapper">
                    <LockKeyhole className="register-input-icon" size={18} />

                    <input
                      type={showPassword ? "text" : "password"}
                      id="register-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={7}
                      maxLength={30}
                      required
                    />

                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <small className="password-hint">
                    Password must be 7–30 characters long.
                  </small>
                </div>

                {/* PHONE */}
                <div className="register-field">
                  <label htmlFor="register-phone">Phone Number</label>

                  <div className="register-input-wrapper">
                    <Phone className="register-input-icon" size={18} />

                    <input
                      type="tel"
                      id="register-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="register-field">
                  <label htmlFor="register-address">Address</label>

                  <div className="register-input-wrapper">
                    <MapPin className="register-input-icon" size={18} />

                    <input
                      type="text"
                      id="register-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      autoComplete="street-address"
                      required
                    />
                  </div>
                </div>

                {/* FAVOURITE SPORT */}
                <div className="register-field">
                  <label htmlFor="register-answer">Favourite Sport</label>

                  <div className="register-input-wrapper">
                    <Trophy className="register-input-icon" size={18} />

                    <input
                      type="text"
                      id="register-answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="What is your favourite sport?"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="register-submit">
                  CREATE ACCOUNT
                </button>
              </form>

              <div className="register-footer">
                <span>Already have an account?</span>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="register-login-link"
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

export default Register;
// ______________________________________________________________
