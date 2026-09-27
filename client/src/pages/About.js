import React, { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/About.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Layout title={"About Us - ECommerce Store"}>
      <div className="about-page">
        {/* Hero Section */}
        <div className="container py-4 py-md-5">
          <div className="row align-items-center g-4 g-lg-5">
            {/* Image Column */}
            <div className="col-lg-6" data-aos="fade-right">
              <div className="about-image-wrapper position-relative">
                <img
                  src="/images/about.jpeg"
                  alt="About Us"
                  className="img-fluid rounded-4 shadow-lg about-main-img"
                />
                <div className="experience-badge bg-primary text-white p-3 rounded-4 shadow position-absolute d-none d-sm-flex align-items-center gap-3">
                  <span className="fs-1 fw-bold">10+</span>
                  <span className="badge-text text-start">
                    Years of <br /> Excellence
                  </span>
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="about-content">
                <span className="sub-title text-primary fw-semibold text-uppercase tracking-wider">
                  Our Story
                </span>
                <h1 className="display-5 fw-bold text-dark mt-2 mb-3">
                  Crafting Better Shopping Experiences
                </h1>
                <p className="lead text-muted mb-4">
                  Welcome to our store! We are dedicated to delivering the finest
                  quality products directly to your doorstep with unbeatable value
                  and customer service.
                </p>
                <p className="text-secondary mb-4">
                  Founded with a passion for excellence, our mission is to empower
                  shoppers everywhere by making online retail seamless, reliable,
                  and enjoyable. From handpicked items to dedicated support, we
                  prioritize your satisfaction at every step.
                </p>

                {/* Quick Stats Grid */}
                <div className="row g-3 stats-grid mt-2">
                  <div className="col-4">
                    <div className="stat-card p-3 rounded-3 text-center">
                      <h3 className="fw-bold text-primary mb-1">50k+</h3>
                      <p className="small text-muted mb-0">Happy Clients</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-card p-3 rounded-3 text-center">
                      <h3 className="fw-bold text-primary mb-1">100%</h3>
                      <p className="small text-muted mb-0">Original Items</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-card p-3 rounded-3 text-center">
                      <h3 className="fw-bold text-primary mb-1">24/7</h3>
                      <p className="small text-muted mb-0">Live Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features / Why Choose Us Section */}
        <div className="why-us-section py-5 bg-white border-top border-bottom my-4">
          <div className="container">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="sub-title text-primary fw-semibold text-uppercase">
                Why Choose Us
              </span>
              <h2 className="fw-bold text-dark mt-1">What Sets Us Apart</h2>
            </div>

            <div className="row g-4">
              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
                <div className="feature-card p-4 rounded-4 h-100 text-center">
                  <div className="feature-icon bg-primary-subtle text-primary mb-3 mx-auto">
                    🚀
                  </div>
                  <h5 className="fw-bold mb-2">Fast Shipping</h5>
                  <p className="text-muted small mb-0">
                    Swift and dependable delivery services straight to your location worldwide.
                  </p>
                </div>
              </div>

              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
                <div className="feature-card p-4 rounded-4 h-100 text-center">
                  <div className="feature-icon bg-success-subtle text-success mb-3 mx-auto">
                    🛡️
                  </div>
                  <h5 className="fw-bold mb-2">Secure Transactions</h5>
                  <p className="text-muted small mb-0">
                    Your payments are encrypted with top-tier security standards for peace of mind.
                  </p>
                </div>
              </div>

              <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
                <div className="feature-card p-4 rounded-4 h-100 text-center">
                  <div className="feature-icon bg-warning-subtle text-warning mb-3 mx-auto">
                    ⭐
                  </div>
                  <h5 className="fw-bold mb-2">Premium Quality</h5>
                  <p className="text-muted small mb-0">
                    Every product is meticulously inspected to ensure uncompromised quality standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;