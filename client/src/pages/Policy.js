import React from "react";
import Layout from "../components/Layout/Layout";
import "../styles/Policy.css";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="policy-page">
        <div className="container-fluid policy">
          <div className="policy-heading">
                <span className="policy-badge">
                  <i className="bi bi-shield-lock"></i>
                  Privacy & Security
                </span>

                <h1>Privacy Policy</h1>

                <p className="policy-intro">
                  Your privacy is important to us. This page explains how
                  information is handled while you use our ecommerce platform.
                </p>
              </div>
          <div className="policy-card">
            {/* Image Section */}
            <div className="policy-image-section">
              <div className="policy-image-wrapper">
                <img
                  src="/images/Privacy-Policy.jpg"
                  alt="Privacy Policy"
                  className="policy-image"
                />
              </div>
              
              <div className="policy-image-overlay">
                <span className="policy-image-icon">
                  <i className="bi bi-shield-check"></i>
                </span>
                <div>
                  <h3>Your Privacy Matters</h3>
                  <p>We respect and protect your personal information.</p>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="policy-content">
              <div className="policy-sections">

                <section className="policy-section">
                  <div className="policy-section-icon">
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <h4>Information We Collect</h4>
                    <p>
                      We may collect information that you provide while
                      creating an account, placing an order, updating your
                      profile, or contacting us through the application.
                    </p>
                  </div>
                </section>

                <section className="policy-section">
                  <div className="policy-section-icon">
                    <i className="bi bi-database-check"></i>
                  </div>
                  <div>
                    <h4>How We Use Your Information</h4>
                    <p>
                      Information provided through the application may be used
                      to manage your account, process orders, provide services,
                      and improve your overall shopping experience.
                    </p>
                  </div>
                </section>

                <section className="policy-section">
                  <div className="policy-section-icon">
                    <i className="bi bi-lock"></i>
                  </div>
                  <div>
                    <h4>Data Protection</h4>
                    <p>
                      We take reasonable measures to protect the information
                      associated with your account and to help prevent
                      unauthorized access or misuse.
                    </p>
                  </div>
                </section>

                <section className="policy-section">
                  <div className="policy-section-icon">
                    <i className="bi bi-person-check"></i>
                  </div>
                  <div>
                    <h4>Your Account</h4>
                    <p>
                      You are responsible for keeping your account credentials
                      secure. If you believe your account has been accessed
                      without authorization, please contact us promptly.
                    </p>
                  </div>
                </section>

                <section className="policy-section">
                  <div className="policy-section-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <div>
                    <h4>Policy Updates</h4>
                    <p>
                      This Privacy Policy may be updated from time to time to
                      reflect changes to our application, services, or privacy
                      practices.
                    </p>
                  </div>
                </section>

              </div>

              <div className="policy-footer-note">
                <i className="bi bi-shield-check"></i>
                <span>
                  We are committed to handling your information responsibly
                  and maintaining a secure shopping experience.
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;