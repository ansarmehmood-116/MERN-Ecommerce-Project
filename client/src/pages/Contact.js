import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import {
  BiMailSend,
  BiPhoneCall,
  BiSupport,
  BiMap,
  BiCopy,
  BiCheck,
  BiTimeFive,
  BiGlobe,
  BiShieldQuarter,
} from "react-icons/bi";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Contact.css";

const contactCards = [
  {
    id: "email",
    title: "Email Support",
    value: "help@ecommerceapp.com",
    href: "mailto:help@ecommerceapp.com",
    badge: "Fastest Response",
    note: "Response in ~15 mins",
    icon: <BiMailSend />,
    accent: "blue",
    canCopy: true,
  },
  {
    id: "phone",
    title: "Direct Line",
    value: "+1 (012) 345-6789",
    href: "tel:0123456789",
    badge: "Mon – Fri",
    note: "8:00 AM – 8:00 PM EST",
    icon: <BiPhoneCall />,
    accent: "emerald",
  },
  {
    id: "tollfree",
    title: "Toll-Free Helpline",
    value: "1800-0000-0000",
    href: "tel:18000000000",
    badge: "24/7 Available",
    note: "Free worldwide calling",
    icon: <BiSupport />,
    accent: "amber",
  },
  {
    id: "office",
    title: "Headquarters",
    value: "123 Commerce Way",
    href: "https://maps.google.com/?q=123+Commerce+Way+Tech+District",
    badge: "Tech District",
    note: "Floor 4, Suite 400",
    icon: <BiMap />,
    accent: "purple",
    external: true,
  },
];

const Contact = () => {
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const copyToClipboard = (text, id, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout title={"Contact Us | Premium E-Commerce"}>
      <div className="contact-page-wrapper">
        <div className="contact-bg-glow glow-top" />
        <div className="contact-bg-glow glow-bottom" />

        <div className="contact-container">
          {/* Header section */}
          <div className="contact-hero-header" data-aos="fade-down">
            <div className="status-pill">
              <span className="pulse-indicator" />
              <span>Support Desk Live</span>
            </div>
            <h1>We're here to help you</h1>
            <p>
              Have a question about an order, return, or partnership? Connect
              with our dedicated support specialists through any channel below.
            </p>
          </div>

          {/* Main Content Layout */}
          <div className="contact-main-grid" data-aos="fade-up">
            {/* Left Column: Visual Brand Card */}
            <div className="visual-brand-card">
              <div className="visual-img-container">
                <img
                  src="/images/contactus.jpeg"
                  alt="Customer Support Specialists"
                  className="visual-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="visual-scrim" />
              </div>

              <div className="visual-overlay-content">
                <span className="visual-tag">24/7 Priority Support</span>
                <h2>Dedicated to your seamless shopping experience</h2>
                <p>
                  Our global team ensures that every query is handled with care
                  and resolved without delay.
                </p>

                <div className="visual-metrics">
                  <div className="metric-box">
                    <span className="metric-number">&lt;15m</span>
                    <span className="metric-label">Avg Response</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-box">
                    <span className="metric-number">99.4%</span>
                    <span className="metric-label">Resolved First-Call</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-box">
                    <span className="metric-number">24/7</span>
                    <span className="metric-label">Worldwide Help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 2x2 Bento Contact Grid */}
            <div className="bento-channels-wrapper">
              <div className="bento-grid">
                {contactCards.map((card) => (
                  <a
                    key={card.id}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className={`bento-card bento-${card.accent}`}
                  >
                    <div className="bento-header">
                      <div className={`bento-icon-box icon-${card.accent}`}>
                        {card.icon}
                      </div>
                      <span className="bento-badge">{card.badge}</span>
                    </div>

                    <div className="bento-body">
                      <span className="bento-label">{card.title}</span>
                      <h3 className="bento-value">{card.value}</h3>
                      <span className="bento-note">{card.note}</span>
                    </div>

                    <div className="bento-footer">
                      {card.canCopy ? (
                        <button
                          type="button"
                          className="quick-action-btn"
                          title="Copy to clipboard"
                          onClick={(e) => copyToClipboard(card.value, card.id, e)}
                        >
                          {copiedId === card.id ? (
                            <>
                              <BiCheck className="btn-icon success-icon" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <BiCopy className="btn-icon" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="arrow-link">
                          Connect <span>→</span>
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="trust-banner">
                <div className="trust-point">
                  <BiShieldQuarter className="trust-icon" />
                  <span>End-to-End Secure Support</span>
                </div>
                <div className="trust-point">
                  <BiGlobe className="trust-icon" />
                  <span>Multilingual Assistance</span>
                </div>
                <div className="trust-point">
                  <BiTimeFive className="trust-icon" />
                  <span>Real-Time Ticket Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
