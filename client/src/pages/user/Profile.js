import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import "./UserStyles/UserProfile.css";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Get user data
  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user;
      setName(name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setAddress(address || "");
    }
  }, [auth?.user]);

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm Password Validation
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        if (ls) {
          ls = JSON.parse(ls);
          ls.user = data.updatedUser;
          localStorage.setItem("auth", JSON.stringify(ls));
        }
        setPassword("");
        setConfirmPassword("");
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Your Profile - ECommerce App"}>
      <div className="user-profile-page">
      <div className="container-fluid p-3 dashboard">
        <div className="row g-3">
          
          {/* User Navigation Sidebar */}
          <div className="col-md-12 col-lg-3">
            <UserMenu />
          </div>

          {/* Profile Update Card */}
          <div className="col-lg-9 col-md-12">
            <div className="card border-0 rounded-2 overflow-hidden mb-4 updateContainer">
              
              {/* Header Banner */}
              <div className="p-3 d-flex align-items-center justify-content-between dashboardHeading rounded-top-2">
                <div>
                  <h4 className="fw-bold mb-1">USER PROFILE</h4>
                  <p className="mb-0 opacity-75 small">Update your personal account settings</p>
                </div>
                <i className="bi bi-person-gear fs-1 opacity-50"></i>
              </div>

              {/* Form Body */}
              <div className="card-body p-4 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    
                    {/* Name Field */}
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-secondary">
                        Full Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control bg-light border-start-0 ps-0 shadow-none"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    {/* Email Field (Disabled) */}
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-secondary">
                        Email Address <span className="small text-muted">(Read-only)</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-secondary-subtle border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          value={email}
                          className="form-control bg-secondary-subtle border-start-0 ps-0 shadow-none"
                          disabled
                        />
                      </div>
                    </div>

                    {/* New Password Field */}
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-secondary">
                        New Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control bg-light border-start-0 ps-0 shadow-none"
                          placeholder="Leave blank to keep current"
                        />
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-secondary">
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-shield-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-control bg-light border-start-0 ps-0 shadow-none"
                          placeholder="Re-enter new password"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="col-md-12 mb-2">
                      <label className="form-label fw-semibold text-secondary">
                        Phone Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-telephone text-muted"></i>
                        </span>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-control bg-light border-start-0 ps-0 shadow-none"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    {/* Address Field */}
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold text-secondary">
                        Shipping Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-geo-alt text-muted"></i>
                        </span>
                        <textarea
                          rows="2"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="form-control bg-light border-start-0 ps-0 shadow-none"
                          placeholder="Enter full shipping address"
                        ></textarea>
                      </div>
                    </div>

                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn px-4 py-2 text-white fw-semibold rounded-3 shadow-sm d-inline-flex align-items-center gap-2"
                      style={{ backgroundColor: "#00bfff", borderColor: "#00bfff" }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill"></i>
                          UPDATE PROFILE
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Profile;
//_________________________________________________________________________
