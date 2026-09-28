import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import {
  HiArrowLeft,
  HiPrinter,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi2";
import "./AdminStyles/AdminInvoice.css";
//_______________________________________________________________________________

const Invoice = ({ order: propOrder }) => {
  const [order, setOrder] = useState(propOrder || null);
  const [loading, setLoading] = useState(!propOrder);

  const navigate = useNavigate();
  const { orderId } = useParams();

  //_________use_it_when_donot_backend_Controller_So_use_localStorage___________
  // useEffect(() => {
  //   if (!propOrder) {
  //     const savedOrder = localStorage.getItem("invoiceOrder");

  //     if (savedOrder) {
  //       try {
  //         const parsed = JSON.parse(savedOrder);

  //         if (!orderId || parsed.id === orderId) {
  //           setOrder(parsed);
  //         }
  //       } catch (err) {
  //         console.error("Error loading invoice data", err);
  //       }
  //     }
  //   }
  // }, [propOrder, orderId]);
  //____________________________________________________________________________

  // Fetch single order with out API if prop is passed from parent component directly
  useEffect(() => {
    if (propOrder) {
      setOrder(propOrder);
      setLoading(false);
      return;
    }
    // Fetch single order from API if prop is not passed directly
    const getOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/order/singleOrder/${orderId}`,
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
  // =====================================================================
  // OLD V1 GROUPING LOGIC
  // =====================================================================
  // V1 schema stored products like:
  // products: [productId, productId, productId]
  // Therefore we had to group duplicate products manually.
  // THIS IS NO LONGER NEEDED IN ORDER SCHEMA V2 because V2 already stores:
  // {
  //   product: productId,
  //   quantity: 2,
  //   price: 500
  // }
  // Keeping this commented instead of deleting it so you can see
  // what was changed.
  // Aggregate duplicate products and compute item quantities
  // const groupedProducts = useMemo(() => {
  //   if (!order?.products) return [];
  //   const map = new Map();
  //   order.products.forEach((product) => {
  //     const key = product._id || product.name;
  //     if (map.has(key)) {
  //       const existing = map.get(key);
  //       existing.quantity += 1;
  //       existing.itemTotal += product.price || 0;
  //     } else {
  //       map.set(key, {
  //         ...product,
  //         quantity: 1,
  //         price: product.price || 0,
  //         itemTotal: product.price || 0,
  //       });
  //     }
  //   });
  //   return Array.from(map.values());
  // }, [order]);

  // =====================================================================
  // V2 PRODUCTS
  // =====================================================================
  // Order Schema V2 already contains quantity and purchase-time price.
  // So we directly use order.products.
  //
  // item.price       = price at the time of purchase
  // item.quantity    = quantity purchased
  // item.product     = actual product information
  //
  const invoiceProducts = useMemo(() => {
    // Jab useMemo ka loop chalta hai, toh wo har product ke liye ek naya object banata hai.Us naye object ke andar wo itemTotal ki property khud se create karta hai (itemTotal: product.price).Agar same product dobara milta hai (quantity 2 hoti hai), toh wo itemTotal mein uski price mazeed plus kar deta hai.
    if (!order?.products) return [];
    return order.products.map((item) => ({
      ...item,
      // Calculate line total using PURCHASE-TIME price
      itemTotal: (item?.price || 0) * (item?.quantity || 0),
    }));
  }, [order]);
  // =====================================================================
  // V2 TOTAL CALCULATION
  // =====================================================================
  // IMPORTANT:
  // DO NOT use:
  // item.product.price
  // because product.price can change later.
  // Example:
  // Purchase time:
  // product.price = $500
  // Later:
  // product.price = $650
  // Invoice must still show:
  // $500
  // Therefore we use:
  // item.price

  const total = useMemo(() => {
    // return groupedProducts.reduce((sum, item) => sum + item.itemTotal, 0);
    //   }, [groupedProducts]); //this was used with groupedProduct function
    return invoiceProducts.reduce((sum, item) => {
      return sum + item.itemTotal;
    }, 0);
  }, [invoiceProducts]);

  // Currency Formatter Utility
  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  // __________________________________________________________________________
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
  // __________________________________________________________________________
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
              <HiArrowLeft />
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title={`Invoice - #${order._id?.slice(-6) || ""}`}>
      <div className="container py-4 my-2 mt-5">
        {/* Control Bar - Hidden during printing */}
        <div
          className="d-flex justify-content-between align-items-center mx-auto mb-3 d-print-none"
          style={{ maxWidth: "780px", width: "100%" }}
        >
          <button
            type="button"
            className="btn btn-dark btn-sm d-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
            onClick={() => navigate(-1)}
          >
            <HiArrowLeft className="fs-6" /> Go Back
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm px-4 py-2 fw-semibold"
            onClick={() => window.print()}
          >
            <HiPrinter className="fs-6" /> Print Invoice
          </button>
        </div>

        {/* POS Printer Wrapper Container */}
        <div className="printer-wrapper">
          {/* Realistic 3D Machine Header */}
          <div className="printer-top d-print-none">
            <div className="printer-brand">
              POS-PRINTER <span className="text-info fs-7">X-80</span>
            </div>

            <div className="printer-screen">
              <span
                className="spinner-grow spinner-grow-sm text-success"
                role="status"
              ></span>
              <span className="printer-screen-text">PRINTING INVOICE...</span>
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
            <div className="card border-0 mx-auto p-4 p-md-5 bg-white text-dark invoice-container printable-area animated-receipt">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4 p-4">
                <div>
                  <h2
                    className="fw-bold tracking-tight mb-1"
                    style={{ color: "#00bfff" }}
                  >
                    ECOMMERCE-STORE
                  </h2>
                  <p className="text-muted small mb-0">
                    Official Purchase Invoice
                  </p>
                </div>
                <div className="text-end">
                  <span className="badge fs-6 px-3 py-2 rounded-pill bg-light text-dark border">
                    INVOICE
                  </span>
                  <p className="small text-muted mb-0 mt-2">
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
                  <div className="p-3 bg-light rounded-3 h-100 border">
                    <h6 className="fw-bold text-uppercase text-muted fs-7 mb-2">
                      Order Summary
                    </h6>
                    <p className="mb-1">
                      <strong>Order Reference:</strong>{" "}
                      <span className="font-monospace">#{order._id}</span>
                    </p>
                    <p className="mb-1">
                      <strong>Date & Time:</strong>{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="mb-0">
                      <strong>Order Status:</strong>{" "}
                      <span className="badge bg-secondary text-uppercase ms-1">
                        {/* {order.status} */}
                        {order?.status?.toLowerCase() === "cancel"
                          ? "cancelled"
                          : order?.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 h-100 border">
                    <h6 className="fw-bold text-uppercase text-muted fs-7 mb-2">
                      Billed To
                    </h6>
                    <p className="mb-1 fw-bold text-dark">
                      {order?.buyer?.name || "N/A"}
                    </p>
                    <p className="mb-1 small text-muted">
                      {order?.buyer?.email || "No Email Provided"}
                    </p>
                    <p className="mb-0 small text-muted">
                      {order?.buyer?.phone || "No Phone Provided"}
                    </p>
                  </div>
                </div>
              </div>
              {/* =========================================================
                    SHIPPING ADDRESS
                    Every order in this store requires shipping
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
                    <div className="invoice-shipping-person">
                      <span className="invoice-shipping-label">Recipient</span>
                      <strong>{order.shippingAddress.name || "N/A"}</strong>
                    </div>

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
              {/* =========================================================
                  V2 PRODUCT TABLE
                  ========================================================= */}
              <div className="table-responsive mb-4">
                <table className="table table-striped table-borderless align-middle mb-0">
                  <thead className="table-dark">
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
                  {/* _____Old Version Table body for groupedProducts function____ */}
                  {/* <tbody>
                    {groupedProducts.map((item, idx) => (
                      <tr key={item._id || idx} className="border-bottom">
                        <td className="px-3 text-muted">{idx + 1}</td>
                        <td className="fw-semibold">{item.name}</td>
                        <td className="text-center fw-bold">
                          {item.quantity}x
                        </td>
                        <td className="text-end font-monospace">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="text-end px-3 font-monospace fw-bold">
                          {formatCurrency(item.itemTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
                  {/* _____New Version Table body without duplicate Products see orderModel for detail undersatnding____ */}
                  <tbody>
                    {invoiceProducts.map((item, idx) => (
                      <tr
                        key={item?.product?._id || idx}
                        className="border-bottom"
                      >
                        <td className="px-3 text-muted">{idx + 1}</td>
                        <td className="fw-semibold">
                          {item?.product?.name || "Product"}
                        </td>
                        <td className="text-center fw-bold">
                          {item?.quantity || 0}x
                        </td>
                        {/* IMPORTANT: Use item.price NOT item.product.price */}
                        <td className="text-end font-monospace">
                          {formatCurrency(item?.price)}
                        </td>
                        {/* IMPORTANT: Purchase Price × Purchased Quantity */}
                        <td className="text-end px-3 font-monospace fw-bold">
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
                    <strong className="text-muted">Payment Status:</strong>
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
                  <div className="p-3 bg-light rounded-3 border w-100 d-flex flex-column align-items-center justify-content-center text-center">
                    <small className="text-uppercase text-muted d-block fw-bold fs-7 mb-1">
                      Total Amount Paid
                    </small>
                    <span className="fs-3 fw-bold text-dark font-monospace">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="my-3" />
              {/* Footer Note */}
              <div className="d-flex justify-content-between align-items-center pt-2">
                <p className="mb-0 text-muted small">
                  Thank you for choosing <strong>YOUR STORE</strong>!
                </p>
                <span className="small text-muted font-monospace">
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
// __________________________________________________________________________________
