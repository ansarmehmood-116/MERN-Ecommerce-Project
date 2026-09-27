import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "./../../components/Layout/Layout";
import { HiArrowLeft } from "react-icons/hi2";
import { AiOutlineReload } from "react-icons/ai";
import { useAuth } from "../../context/auth";
import "./AdminStyles/TransactionHis.css";

const TransactionHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [correctStatus, setCorrectStatus] = useState("");
  const [reason, setReason] = useState("");
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(true); //main loader state best industry standard to keep it true because everytime when transactionHistory laods it runs from the start for userexperience if we keep it false here and make it true in try{} block in getTransactions() function so Screen par 1 fraction of second ke liye "No data found" ya empty table show hota hai, phir Spinner aata hai, aur phir Data aata hai.

  //___For__Paging__States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadbtnstate, setLoadbtnstate]=useState(false);//loadMore button state

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const getTransactions = async (pageNumber = 1,loadMore = false) => {
    try {
      //__use it when no need of paging__
      // const { data } = await axios.get("/api/v1/payment/transaction-history");
      // if (data?.success) {
      //   setOrders(data.orders);
      // }//_________________________________________

      //Remove_this_api when no paging needed from line 38 to 50
      if(loadMore){
        setLoadbtnstate(true);
      }
      const { data } = await axios.get(
        `/api/v1/payment/transaction-history?page=${pageNumber}&limit=6`,
      );
      if (loadMore) {
        setOrders((prev) => [...prev, ...data?.orders]);
      } else {
        setOrders(data?.orders);
      }
       setPage(pageNumber);
       setHasMore(data?.hasMore);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to load transaction history",
      );
    } finally {
      if (loadMore) {
      setLoadbtnstate(false);//this will false when loadmore btn load more pages
    } else {
      setLoading(false);//this will false only when page loads
    }
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getTransactions(1, false);
    }
  }, [auth?.token]);
  //__________________________________________________________________________
  const openCorrectStatus = (order) => {
    setSelectedOrder(order);
    setCorrectStatus(order.status);
    setReason("");
  };
  //__________________________________________________________________________

  const handleCorrectStatus = async () => {
    try {
      if (!reason.trim()) {
        toast.error("Please provide a reason for correction");
        return;
      }
      const { data } = await axios.put(
        `/api/v1/order/correct-order-status/${selectedOrder._id}`,
        {
          status: correctStatus,
          reason,
        },
      );
      if (data.success) {
        toast.success(data.message);
        setSelectedOrder(null);
        setReason("");
        //getTransactions();//use it when paging is not used

        //Refresh from first page this is used only for paging otherwise remove these
        setPage(1);
        getTransactions(1);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to correct order status",
      );
    }
  };
  //_____________________________________________________________________

  const handleInvoice = (order) => {
    try {
      if (!order?._id) {
        toast.error("Invalid order data");
        return;
      }
      // Save order data to local storage_invoice.js will get from localStorage
      // localStorage.setItem("invoiceOrder", JSON.stringify(order));//it was only used when i have not added SingleOrderController for invoice
      // Perform navigation
      navigate(`/dashboard/admin/invoice/${order._id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Could not navigate to invoice");
    }
  };
  //_______________________________________________________________________
  // Robust Filter Logic
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();

    const orderId = (order?._id || "").toLowerCase();
    const buyerName = (order?.buyer?.name || "").toLowerCase();
    const buyerEmail = (order?.buyer?.email || "").toLowerCase();
    const buyerPhone = (order?.buyer?.phone || "").toLowerCase();

    const matchesQuery =
      query === "" ||
      orderId.includes(query) ||
      buyerName.includes(query) ||
      buyerEmail.includes(query) ||
      buyerPhone.includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      (order?.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  return (
    <Layout title={"Transaction History"}>
      <div className="transaction-history-page">
      <div className="container p-4 dashboard">
        {/* Transaction History Heading Banner with Embedded Back Button */}
        <div className="d-flex align-items-center mb-4 TransactionHeading p-2 rounded-2 position-relative">
          <button
            className="btn btn-sm btn-light d-flex align-items-center gap-1 position-absolute start-0 ms-3"
            onClick={() => navigate(-1)}
          >
            <HiArrowLeft className="fs-6" /> Back
          </button>
          <h2 className="mb-0 flex-grow-1 text-center">Transaction History</h2>
        </div>
        {/* Search and Filter Controls */}
        <div className="row g-2 mb-4">
          <div className="col-md-8 col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Order ID, Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4 col-12">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Not Process">Not Process</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancel">Cancelled</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "40vh" }}
          >
            <div className="spinner-border text-grey" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Transactions Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-4 text-muted fs-5">
                No matching transactions found.
              </div>
            ) : (
              <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Order ID</th>
                      <th className="text-center">Customer</th>
                      <th className="text-center">Contact Info</th>
                      <th className="text-center">Payment</th>
                      <th className="text-center">Total Paid</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order,i) => {
                      // const totalAmount = order?.products?.reduce(
                      //   (acc, item) =>
                      //     acc +
                      //     (item.price || 0) * (item.quantity || item.count || 1),
                      //   0,
                      // ); we also can call this totalAmount function total paid but i have used direct function there instead of calling this
                      return (
                        <React.Fragment key={order._id}>
                          <tr>
                            <td className="text-center">
                              <strong>{i + 1}</strong></td>
                            <td className="text-center">
                              <strong>#{order._id.slice(-6)}</strong>
                            </td>
                            <td className="text-center">
                              {order?.buyer?.name || "N/A"}
                            </td>
                            <td className="text-center">
                              <small className="d-block text-dark">
                                {order?.buyer?.phone || "No Phone"}
                              </small>
                              <small className="d-block text-muted">
                                {order?.buyer?.email || "No Email"}
                              </small>
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${order?.payment?.success ? "bg-success" : "bg-danger"}`}
                              >
                                {order?.payment?.success ? "Success" : "Failed"}
                              </span>
                            </td>
                            <td className="text-center">
                              <strong className="text-dark">
                                $
                                {
                                order?.payment?.transaction?.amount ||
                                  order?.products?.reduce(
                                    (acc, item) =>
                                      acc +
                                      (item.price || 0) *
                                        (item.quantity || item.count || 1),
                                    0,
                                  ) ||
                                  "0.00"}{" "}
                                USD
                              </strong>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-secondary">
                                {/* {order.status} */}
                                {order?.status?.toLowerCase() === "cancel"
                                  ? "Cancelled"
                                  : order?.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <small>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-warning me-2"
                                onClick={() => openCorrectStatus(order)}
                              >
                                Correct
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleInvoice(order)}
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>

                          {/* Inline Status Correction Form Row */}
                          {selectedOrder?._id === order._id && (
                            <tr>
                              <td colSpan="8" className="bg-light p-3">
                                <div className="card border p-3">
                                  <h6 className="mb-2">Correct Order Status</h6>
                                  <div className="row g-2">
                                    <div className="col-md-4">
                                      <select
                                        className="form-select form-select-sm"
                                        value={correctStatus}
                                        onChange={(e) =>
                                          setCorrectStatus(e.target.value)
                                        }
                                      >
                                        <option value="Not Process">
                                          Not Process
                                        </option>
                                        <option value="Processing">
                                          Processing
                                        </option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="delivered">
                                          delivered
                                        </option>
                                        <option value="cancel">cancel</option>
                                      </select>
                                    </div>
                                    <div className="col-md-8">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Reason for correction..."
                                        value={reason}
                                        onChange={(e) =>
                                          setReason(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-3 d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={handleCorrectStatus}
                                    >
                                      Save Correction
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => setSelectedOrder(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="m-2 p-3 load-more-container">
              {hasMore && (
                <button
                  className="btn loadmore"
                  onClick={()=>getTransactions(page+1,true)}
                  disabled={loadbtnstate}
                >
                  {loadbtnstate ? (
                    "Loading ..."
                  ) : (
                    <>
                      {" "}
                      Loadmore <AiOutlineReload />
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default TransactionHistory;
