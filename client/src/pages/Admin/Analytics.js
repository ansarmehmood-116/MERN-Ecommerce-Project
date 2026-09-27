import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaEye,
  FaBoxOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

import "./AdminStyles/Analytics.css";

const Analytics = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("30days");
  const [loading, setLoading] = useState(true);

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/analytics?period=${period}`);

      if (data?.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.log("Analytics error:", error);

      toast.error(error?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, [period]);

  // this is not a good practice it bores the user instead of this i have used below loading
  if (loading) {
    return (
      <Layout title="Analytics">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-grey" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="analytics-loading">Loading analytics...</div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout title="Analytics">
        <div className="analytics-loading">No analytics data available.</div>
      </Layout>
    );
  }

  const {
    sales,
    orders,
    customers,
    products,
    payments,
    visits,
    salesOverTime,
    recentOrders,
  } = analytics;

  // ================= FRONTEND OPTIMIZATION =================
  // Calculate maximum values only once instead of inside map()

  const maxSales = Math.max(
    ...salesOverTime.map((sale) => Number(sale.sales) || 0),
    1,
  );

  const maxVisits = Math.max(
    ...visits.overTime.map((visit) => Number(visit.visits) || 0),
    1,
  );

  return (
    <Layout title="Admin Analytics">
      <div className="container-fluid p-3 dashboard analytics-page">
        {/* ================= HEADER ================= */}
        <div className="analytics-header" style={{ background: "skyblue" }}>
          <div>
            <h1>Analytics Dashboard</h1>

            <p>
              Monitor sales, orders, customers, products and website traffic.
            </p>
          </div>

          <div className="analytics-actions">
            <select
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>

              <option value="30days">Last 30 Days</option>

              <option value="thisMonth">This Month</option>
            </select>

            <button
              className="btn btn-outline-secondary"
              onClick={getAnalytics}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="row g-3 mb-4">
          {/* Customers */}

          <div className="col-xl-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-icon">
                <FaUsers />
              </div>

              <div>
                <span>Total Customers</span>

                <h3>{customers?.total || 0}</h3>

                <small>+{customers?.new || 0} new</small>
              </div>
            </div>
          </div>

          {/* Orders */}

          <div className="col-xl-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-icon">
                <FaShoppingCart />
                {/* 🛒 */}
              </div>

              <div>
                <span>Total Orders</span>

                <h3>{orders?.total || 0}</h3>

                <small>{orders?.delivered || 0} delivered</small>
              </div>
            </div>
          </div>

          {/* Sales */}

          <div className="col-xl-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-icon">
                <FaDollarSign />
              </div>

              <div>
                <span>Total Sales</span>

                <h3>${Number(sales?.total || 0).toFixed(2)}</h3>

                <small>
                  Avg: ${Number(sales?.averageOrderValue || 0).toFixed(2)}
                </small>
              </div>
            </div>
          </div>

          {/* Visits */}

          <div className="col-xl-3 col-md-6">
            <div className="analytics-card">
              <div className="analytics-icon">
                <FaEye />
              </div>

              <div>
                <span>Total Visits</span>

                <h3>{visits?.total || 0}</h3>

                <small>{visits?.unique || 0} unique</small>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SALES OVERVIEW ================= */}

        <div className="analytics-section">
          <div className="section-heading">
            <h3>Sales Overview</h3>

            <span>
              {period === "7days"
                ? "Last 7 Days"
                : period === "30days"
                  ? "Last 30 Days"
                  : "This Month"}
            </span>
          </div>

          <div className="sales-summary">
            <div>
              <span>Total Sales</span>

              <strong>${Number(sales?.total || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>Today</span>

              <strong>${Number(sales?.today || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>This Week</span>

              <strong>${Number(sales?.weekly || 0).toFixed(2)}</strong>
            </div>

            <div>
              <span>This Month</span>

              <strong>${Number(sales?.monthly || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div className="sales-chart">
            {salesOverTime?.length > 0 ? (
              salesOverTime.map((item) => {
                const percentage = (Number(item.sales) / maxSales) * 100;

                return (
                  <div className="chart-column" key={item.date}>
                    <div className="chart-value">
                      ${Number(item.sales).toFixed(0)}
                    </div>

                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${Math.max(percentage, 3)}%`,
                        }}
                      />
                    </div>

                    <small>{moment(item.date).format("MMM D")}</small>
                  </div>
                );
              })
            ) : (
              <div className="no-data">No sales data available.</div>
            )}
          </div>
        </div>

        {/* ================= ORDER STATUS + CUSTOMER ================= */}

        <div className="row g-3 mb-4">
          {/* Order Status */}

          <div className="col-lg-6">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Order Status</h3>
              </div>

              <div className="status-list">
                <div className="status-item">
                  <span>Not Process</span>

                  <strong>{orders?.notProcess || 0}</strong>
                </div>

                <div className="status-item">
                  <span>Processing</span>

                  <strong>{orders?.processing || 0}</strong>
                </div>

                <div className="status-item">
                  <span>Shipped</span>

                  <strong>{orders?.shipped || 0}</strong>
                </div>

                <div className="status-item">
                  <span>Delivered</span>

                  <strong>{orders?.delivered || 0}</strong>
                </div>

                <div className="status-item">
                  <span>Cancelled</span>

                  <strong>{orders?.cancelled || 0}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Overview */}

          <div className="col-lg-6">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Customer Overview</h3>
              </div>

              <div className="customer-stats">
                <div className="customer-stat">
                  <FaUsers />

                  <span>Total Customers</span>

                  <strong>{customers?.total || 0}</strong>
                </div>

                <div className="customer-stat">
                  <FaCheckCircle />

                  <span>Customers With Orders</span>

                  <strong>{customers?.withOrders || 0}</strong>
                </div>

                <div className="customer-stat">
                  <FaUsers />

                  <span>New Customers</span>

                  <strong>{customers?.new || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="row g-3 mb-4">
          {/* Best Selling */}

          <div className="col-lg-8">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Best Selling Products</h3>
              </div>

              {products?.bestSelling?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table analytics-table align-middle">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                        <th>Stock</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.bestSelling.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <strong>{product.name}</strong>
                          </td>

                          <td>{product.soldQuantity}</td>

                          <td>${Number(product.revenue || 0).toFixed(2)}</td>

                          <td>{product.currentStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">No sales data available.</div>
              )}
            </div>
          </div>

          {/* Inventory */}

          <div className="col-lg-4">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Inventory</h3>
              </div>

              <div className="inventory-list">
                <div className="inventory-item">
                  <FaBoxOpen />

                  <span>Total Products</span>

                  <strong>{products?.total || 0}</strong>
                </div>

                <div className="inventory-item">
                  <FaTimesCircle />

                  <span>Out of Stock</span>

                  <strong>{products?.outOfStock || 0}</strong>
                </div>

                <div className="inventory-item">
                  <FaExclamationTriangle />

                  <span>Low Stock</span>

                  <strong>{products?.lowStock || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAYMENTS + VISITS ================= */}

        <div className="row g-3 mb-4">
          {/* Payments */}

          <div className="col-lg-6">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Payments</h3>
              </div>

              <div className="payment-stats">
                <div className="payment-stat">
                  <FaCheckCircle />

                  <span>Successful</span>

                  <strong>{payments?.successful || 0}</strong>
                </div>

                <div className="payment-stat">
                  <FaTimesCircle />

                  <span>Failed</span>

                  <strong>{payments?.failed || 0}</strong>
                </div>

                <div className="payment-stat">
                  <FaDollarSign />

                  <span>Revenue</span>

                  <strong>${Number(payments?.revenue || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Visits */}

          <div className="col-lg-6">
            <div className="analytics-section h-100">
              <div className="section-heading">
                <h3>Website Traffic</h3>
              </div>

              <div className="traffic-stats">
                <div>
                  <span>Total Visits</span>

                  <strong>{visits?.total || 0}</strong>
                </div>

                <div>
                  <span>Today's Visits</span>

                  <strong>{visits?.today || 0}</strong>
                </div>

                <div>
                  <span>Unique Visitors</span>

                  <strong>{visits?.unique || 0}</strong>
                </div>
              </div>

              <div className="visit-chart">
                {visits?.overTime?.length > 0 ? (
                  visits.overTime.map((item, index) => {
                    const percentage = (Number(item.visits) / maxVisits) * 100;

                    return (
                      <div className="visit-row" key={item.date}>
                        <span>{moment(item.date).format("MMM D")}</span>

                        <div className="visit-bar-container">
                          <div
                            className="visit-bar"
                            style={{
                              width: `${Math.max(percentage, 2)}%`,
                            }}
                          />
                        </div>

                        <strong>{item.visits}</strong>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data">No visit data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div className="analytics-section mb-4">
          <div className="section-heading">
            <h3>Recent Orders</h3>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/dashboard/admin/orders")}
            >
              View All
            </button>
          </div>

          {recentOrders?.length > 0 ? (
            <div className="table-responsive">
              <table className="table analytics-table align-middle">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => {
                    const amount = order?.products?.reduce(
                      (total, item) =>
                        total +
                        Number(item.price || 0) * Number(item.quantity || 0),
                      0,
                    );

                    return (
                      <tr key={order._id}>
                        <td>
                          <strong>#{order._id.slice(-6)}</strong>
                        </td>

                        <td>{order?.buyer?.name || "N/A"}</td>

                        <td>
                          {order?.products?.reduce(
                            (total, item) => total + Number(item.quantity || 0),
                            0,
                          )}
                        </td>

                        <td>${amount.toFixed(2)}</td>

                        <td>
                          <span className="badge bg-secondary">
                            {order.status}
                          </span>
                        </td>

                        <td>{moment(order.createdAt).format("MMM D, YYYY")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No recent orders.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
