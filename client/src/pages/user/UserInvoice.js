import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import Layout from "../../components/Layout/Layout";
import {
  HiArrowLeft,
  HiArrowDownTray,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi2";
import "./UserStyles/UserInvoice.css";

const Invoice = ({ order: propOrder }) => {
  const [order, setOrder] = useState(propOrder || null);
  const [loading, setLoading] = useState(!propOrder);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();
  const { orderId } = useParams();
  const invoiceRef = useRef(null); // Document reference for html2canvas

  // Fetch single order with out API if prop is passed from parent component directly
  useEffect(() => {
    if (propOrder) {
      setOrder(propOrder);
      setLoading(false);
      return;
    }
    // if no prop from parent component then we use the following backend API
    const getOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/order/Buyer/OrderInvoice/${orderId}`,
        );
        if (data?.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      getOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, propOrder]);

  const invoiceProducts = useMemo(() => {
    if (!order?.products) return [];
    return order.products.map((item) => ({
      ...item,
      itemTotal: (item?.price || 0) * (item?.quantity || 0),
    }));
  }, [order]);

  const total = useMemo(() => {
    return invoiceProducts.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [invoiceProducts]);

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Download Invoice Image Handler
  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // High DPI Resolution Output
        useCORS: true,
        backgroundColor: document.getElementById("dark")
          ? "#1e293b"
          : "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Invoice_${order?._id?.slice(-6) || "receipt"}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate invoice image", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Layout title={"Loading Invoice..."}>
        <div className="container text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading invoice details...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout title={"Invoice - Not Found"}>
        <div className="container text-center py-5 my-5">
          <div
            className="card shadow-sm p-4 mx-auto"
            style={{ maxWidth: "450px" }}
          >
            <h4 className="text-danger fw-bold mb-3">No Invoice Data Found</h4>
            <p className="text-muted mb-4">
              We couldn't retrieve the requested order details.
            </p>
            <button
              className="btn btn-outline-primary d-inline-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate(-1)}
            >
              <HiArrowLeft /> Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Invoice - #${order._id?.slice(-6) || ""}`}>
      <div className="container py-4 my-2 mt-5">
        <div
          className="d-flex justify-content-between align-items-center mx-auto mb-3 d-print-none"
          style={{ maxWidth: "780px", width: "100%" }}
        >
          <button
            type="button"
            className="btn btn-dark shadow-lg d-flex align-items-center gap-2 px-3 py-2 fw-semibold side-btn"
            onClick={() => navigate(-1)}
            title="Go Back"
          >
            <HiArrowLeft className="fs-5" />
            <span className="d-none d-md-inline">Go Back</span>
          </button>

          <button
            type="button"
            className="btn btn-info text-white shadow-lg d-flex align-items-center gap-2 px-3 py-2 fw-semibold side-btn"
            onClick={handleDownloadImage}
            disabled={downloading}
            title="Save as Image"
          >
            <HiArrowDownTray className="fs-5" />
            <span className="d-none d-md-inline">
              {downloading ? "Saving..." : "Save Image"}
            </span>
          </button>
        </div>

        {/* POS Printer Wrapper Container */}
        <div className="printer-wrapper">
          {/* Realistic 3D Machine Header */}
          <div className="printer-top">
            <div className="printer-brand">
              POS-PRINTER <span className="text-info fs-7">X-80</span>
            </div>

            <div className="printer-screen">
              <span
                className="spinner-grow spinner-grow-sm text-success"
                role="status"
              ></span>
              <span className="printer-screen-text">
                {downloading ? "EXPORTING IMAGE..." : "INVOICE READY..."}
              </span>
            </div>

            <div className="printer-controls">
              <div className="btn-power-light" title="Power On"></div>
              <div className="btn-feed" title="Paper Feed">
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#475569",
                    borderRadius: "50%",
                  }}
                ></div>
              </div>
            </div>

            <div className="printer-slot"></div>
          </div>

          {/* Paper Exit Wrapper */}
          <div className="paper-container">
            <div
              ref={invoiceRef}
              className="card border-0 mx-auto p-4 p-md-5 invoice-container printable-area animated-receipt"
            >
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 p-4 invoice-header-box">
                <div>
                  <h2 className="fw-bold tracking-tight mb-1 brand-logo-text">
                    ECOMMERCE-STORE
                  </h2>
                  <p className="text-muted small mb-0 sub-heading">
                    Official Purchase Invoice
                  </p>
                </div>
                <div className="text-end">
                  <span className="badge fs-6 px-3 py-2 rounded-pill status-badge">
                    INVOICE
                  </span>
                  <p className="small text-muted mb-0 mt-2 sub-heading">
                    Issued:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Details Row */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 rounded-3 h-100 border invoice-info-card">
                    <h6 className="fw-bold text-uppercase fs-7 mb-2 card-title-text">
                      Order Summary
                    </h6>
                    <p className="mb-1 info-text">
                      <strong>Order Reference:</strong>{" "}
                      <span className="font-monospace">#{order._id}</span>
                    </p>
                    <p className="mb-1 info-text">
                      <strong>Date & Time:</strong>{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="mb-0 info-text">
                      <strong>Order Status:</strong>{" "}
                      <span className="badge bg-secondary text-uppercase ms-1">
                        {order?.status?.toLowerCase() === "cancel"
                          ? "cancelled"
                          : order?.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-3 h-100 border invoice-info-card">
                    <h6 className="fw-bold text-uppercase fs-7 mb-2 card-title-text">
                      Billed To
                    </h6>
                    <p className="mb-1 fw-bold buyer-name">
                      {order?.buyer?.name || "N/A"}
                    </p>
                    <p className="mb-1 small info-text">
                      {order?.buyer?.email || "No Email Provided"}
                    </p>
                    <p className="mb-0 small info-text">
                      {order?.buyer?.phone || "No Phone Provided"}
                    </p>
                  </div>
                </div>
              </div>
              {/* =========================================================
                 SHIPPING ADDRESS
                 very order in this store requires shipping
            ========================================================= */}
              {order?.shippingAddress && (
                <div className="invoice-shipping-section mb-4">
                  {" "}
                  <div className="invoice-shipping-header">
                    {" "}
                    <div className="invoice-shipping-icon">🚚</div>
                    <div>
                      <h6 className="invoice-shipping-title mb-1">
                        Shipping Address
                      </h6>

                      <p className="invoice-shipping-subtitle mb-0">
                        Delivery information for this order
                      </p>
                    </div>
                  </div>
                  <div className="invoice-shipping-content">
                    {/* Recipient */}
                    <div className="invoice-shipping-person">
                      <span className="invoice-shipping-label">Recipient</span>

                      <strong>{order.shippingAddress.name || "N/A"}</strong>
                    </div>

                    {/* Address Details */}
                    <div className="invoice-shipping-grid">
                      <div className="invoice-shipping-item">
                        <span className="invoice-shipping-label">Phone</span>

                        <span>{order.shippingAddress.phone || "N/A"}</span>
                      </div>

                      <div className="invoice-shipping-item invoice-shipping-address">
                        <span className="invoice-shipping-label">Address</span>

                        <span>{order.shippingAddress.address || "N/A"}</span>
                      </div>

                      <div className="invoice-shipping-item">
                        <span className="invoice-shipping-label">City</span>

                        <span>{order.shippingAddress.city || "N/A"}</span>
                      </div>

                      {order.shippingAddress.state && (
                        <div className="invoice-shipping-item">
                          <span className="invoice-shipping-label">State</span>

                          <span>{order.shippingAddress.state}</span>
                        </div>
                      )}

                      {order.shippingAddress.postalCode && (
                        <div className="invoice-shipping-item">
                          <span className="invoice-shipping-label">
                            Postal Code
                          </span>

                          <span>{order.shippingAddress.postalCode}</span>
                        </div>
                      )}

                      <div className="invoice-shipping-item">
                        <span className="invoice-shipping-label">Country</span>

                        <span>{order.shippingAddress.country || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* V2 Product Table */}
              <div className="table-responsive mb-4">
                <table className="table borderless align-middle mb-0 custom-invoice-table">
                  <thead>
                    <tr>
                      <th scope="col" className="py-2 px-3">
                        #
                      </th>
                      <th scope="col" className="py-2">
                        Item name
                      </th>
                      <th scope="col" className="py-2 text-center">
                        Qty
                      </th>
                      <th scope="col" className="py-2 text-end">
                        Price
                      </th>
                      <th scope="col" className="py-2 text-end px-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceProducts.map((item, idx) => (
                      <tr
                        key={item?.product?._id || idx}
                        className="border-bottom"
                      >
                        <td className="px-3 text-muted">{idx + 1}</td>
                        <td className="fw-semibold item-name">
                          {item?.product?.name || "Product"}
                        </td>
                        <td className="text-center fw-bold item-qty">
                          {item?.quantity || 0}x
                        </td>
                        <td className="text-end font-monospace item-price">
                          {formatCurrency(item?.price)}
                        </td>
                        <td className="text-end px-3 font-monospace fw-bold item-total">
                          {formatCurrency(item?.itemTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Payment & Totals Footer */}
              <div className="row align-items-center justify-content-between pt-2 mb-4">
                <div className="col-sm-6 mb-3 mb-sm-0">
                  <div className="d-flex align-items-center gap-2">
                    <strong className="text-muted sub-heading">
                      Payment Status:
                    </strong>
                    {order?.payment?.success ? (
                      <span className="badge bg-success-subtle text-success border border-success d-inline-flex align-items-center gap-1 px-2 py-1">
                        <HiCheckCircle /> Paid Successfully
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger border border-danger d-inline-flex align-items-center gap-1 px-2 py-1">
                        <HiXCircle /> Unpaid / Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-sm-6 text-sm-end d-flex">
                  <div className="p-3 rounded-3 border w-100 d-flex flex-column align-items-center justify-content-center text-center total-paid-card">
                    <small className="text-uppercase d-block fw-bold fs-7 mb-1 card-title-text">
                      Total Amount Paid
                    </small>
                    <span className="fs-3 fw-bold font-monospace total-amount">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-3 invoice-hr" />

              {/* Footer Note */}
              <div className="d-flex justify-content-between align-items-center pt-2">
                <p className="mb-0 small info-text">
                  Thank you for choosing{" "}
                  <strong className="brand-name">ECOMMERCE-STORE</strong>!
                </p>
                <span className="small font-monospace info-text">
                  Authorized Invoice
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invoice;
