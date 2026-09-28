import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
//import { useAuth } from "../../context/auth";
import Layout from "../../components/Layout/Layout";
import { useOrders } from "../../context/ordersNotifyContext"; //as we have used as context
import moment from "moment";
import { Select } from "antd";
import "./AdminStyles/AdminOrders.css";
import { AiOutlineReload } from "react-icons/ai";
//__________________________________________________________________________
// const AdminOrders = () => {
//  //here we have filled the useState with enum we have
//  //created in orders model.
//   const [status,setStatus] = useState([
//     "Not Process",
//     "Processing",
//     "Shipped",
//     "delivered",
//     "cancel",
//   ]);
//______________________________________________
const { Option } = Select; //we have destructured these option from select.
const AdminOrders = () => {
  //Use context for orders
  const [
    orders,
    setOrders,
    getOrders,
    loading,
    //remove page & hasMore,loadbtnstate if no paging needed
    page,
    hasMore,
    loadbtnstate,
  ] = useOrders();
  // ________For FILTERING ORDERS TYPES_______
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  //const [changeStatus, setCHangeStatus] = useState("");
  //______________________________________________
  //if we donot want to use the context orderProvider then use following function manually here but it will not accessable anywhere except this page.
  // const [auth, setAuth] = useAuth();
  // const [orders, setOrders] = useState([]);
  //   const getOrders = async () => {
  //     try {
  //       const { data } = await axios.get("/api/v1/order/all-orders");
  //       setOrders(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  // useEffect(() => {
  //     if (auth?.token) getOrders();
  // }, [auth?.token]);
  //_______________________________________________________________________________
  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Not Process":
        return ["Processing", "cancel"];
      case "Processing":
        return ["Shipped", "cancel"];
      case "Shipped":
        return ["delivered", "cancel"];
      case "delivered":
      case "cancel":
      default:
        return [];
    }
  };
  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `/api/v1/order/order-status/${orderId}`,
        {
          status: value,
        },
      );
      toast.success(data?.message);
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to update order status",
      );
      getOrders();
    }
  };
  //_________________________________________________________________________
  // _______ONLY FOR ORDER FILTERING________
  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return orders.filter((order) => {
      const customerName = order?.buyer?.name?.toLowerCase() || "";
      const customerEmail = order?.buyer?.email?.toLowerCase() || "";
      const orderId = order?._id?.toLowerCase() || "";
      const matchesSearch =
        !search ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        orderId.includes(search);
      const matchesStatus =
        statusFilter === "All" || order?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);
  // _______________________________________________________
  // OLD groupProducts function is no longer needed
  // because Order Schema V2 already stores quantity directly.
  // const groupProducts = (products) => {
  //   return products?.reduce((acc, product) => {
  //     const foundProduct = acc.find((p) => p._id === product._id);
  //     if (foundProduct) {
  //       foundProduct.quantity += 1;
  //     } else {
  //       acc.push({ ...product, quantity: 1 });
  //     }
  //     return acc;
  //   }, []);
  // };
  //_______________________________________________________________________
  //delete an order__for this backend controller exists in orderController__
  // const handleDelete = async (orderId) => {
  //   try {
  //     let answer = window.prompt("Are You Sure want to delete this order ? ");
  //     //this is used to prevent from accidental deletion.
  //     if (!answer) return;
  //     const { data } = await axios.delete(
  //       `/api/v1/order/delete-order/${orderId}`,
  //     );
  //     toast.success("Order Deleted Succfully");
  //     getOrders();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   }
  // };
  //____________________________________________________________________
  return (
    <Layout title={"All Orders Data"}>
      {/*this wraper is just for css classes leakage prevention */}
      <div className="admin-orders-page">
        <div className="container-fluid p-3 dashboard">
          <div className="row g-3">
            <div className="col-md-3">
              {/* <AdminMenu orders={orders}/>
            it works better but this prop is used only inside orders so it will show notification only in orders page AdminMenu because we have used only in here props so the remaining pages will not know about this props which has adminMenu so either we have to pass {orders} props in all components in adminMenu but this will very difficult to pass in each page manuall so we have used globally context orders*/}
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center ordersHeading p-2 rounded-2 d-flex align-items-center justify-content-center gap-2">
                <span className="mb-1">🛒</span>
                <span className="mb-1">All Orders</span>
              </h1>
              <div className="admin-orders-filters">
                <div className="admin-orders-search-wrap">
                  <input
                    type="text"
                    placeholder="Search by customer, email or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-orders-search"
                  />
                  <span className="admin-orders-result-count">
                    <strong>{filteredOrders.length}</strong>
                    <span>
                      {filteredOrders.length === 1 ? "order" : "orders"}
                    </span>
                  </span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-orders-status-filter"
                >
                  <option value="All">All Orders</option>
                  <option value="Not Process">Not Process</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancel">Cancelled</option>
                </select>
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
              ) : orders && orders?.length > 0 ? (
                <>
                  {/* {orders?.map((o, i) => { this was showing all orders */}
                  {filteredOrders?.map((o, i) => {
                    // const groupedProducts = groupProducts(o?.products);
                    return (
                      <div
                        className="border shadow rounded-2 mb-4 bg-white"
                        key={o._id}
                      >
                        <div className=" rounded-3">
                          <table className="table table-hover mb-0 align-middle table-responsive">
                            <thead className="table-light">
                              <tr>
                                <th scope="col" className="text-center">
                                  #
                                </th>
                                <th scope="col" className="text-center">
                                  Order ID
                                </th>
                                <th scope="col" className="text-center">
                                  Status
                                </th>
                                <th scope="col" className="text-center">
                                  Buyer
                                </th>
                                <th scope="col" className="text-center">
                                  Date
                                </th>
                                <th scope="col" className="text-center">
                                  Payment
                                </th>
                                <th scope="col" className="text-center">
                                  Quantity
                                </th>
                                <th scope="col" className="text-center">
                                  Paid Amount
                                </th>
                                {/* <th scope="col">Delete</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-center">
                                  <strong>#{o?._id?.slice(-6)}</strong>
                                </td>
                                <td className="text-center">
                                  {/* <Select
                            border={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select> */}
                                  <Select
                                    border={false}
                                    value={o?.status}
                                    onChange={(value) =>
                                      handleChange(o._id, value)
                                    }
                                    disabled={
                                      o?.status === "delivered" ||
                                      o?.status === "cancel" ||
                                      o?.payment?.success !== true
                                    }
                                  >
                                    {getAvailableStatuses(o?.status).map(
                                      (s) => (
                                        <Option key={s} value={s}>
                                          {s}
                                        </Option>
                                      ),
                                    )}
                                  </Select>
                                </td>
                                <td className="text-center">
                                  {o?.buyer?.name || "N/A"}
                                </td>
                                <td className="text-center">
                                  {moment(o?.createdAt).fromNow()}
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      o?.payment?.success
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {o?.payment?.success ? "Success" : "Failed"}
                                  </span>
                                </td>
                                {/* <td>{o?.products?.length}</td> */}
                                <td className="text-center">
                                  {/* total items count in order */}
                                  {o?.products?.reduce(
                                    (total, item) =>
                                      total + (item?.quantity || 0),
                                    0,
                                  )}
                                </td>
                                <td className="text-center">
                                  ${o?.payment?.transaction?.amount || "0.00"}
                                </td>
                                {/* <td onClick={() => handleDelete(o._id)}>
                          <MdDelete
                            fontSize={20}
                            style={{ cursor: "pointer", color: "red" }}
                          />
                        </td> */}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* Product Cards Container */}
                        <div className="p-3 bg-light border-top">
                          {/* {groupedProducts?.map((p) => ( */}
                          {o?.products?.map((item) => (
                            <div
                              className="card mb-2 p-2 flex-row align-items-center shadow-sm border-0"
                              key={item?.product?._id}
                              //  key={p._id} used with groupedProduct fucntion above when there was no purchase time price and quantity so we just simply rendered order with products and grouped duplicate products with same product_id and count the quantity and price but now we have changed orderModel to Version 2 see in orderModel and saving orderProducts with quantity and price so it remains unchanged when price of product chnaged later. Aik or chez:- item?.product?.name aur item?.product?.description Products collection se aa rahe hain orderModel mai ham ne ref:Product jo lagaya hai matlab productModel collection ka reference order k andar, isliye product ke andar se field access karni padti hai, item.price aur item.quantity Order ke andar directly stored hain — ye purchase ke waqt ka snapshot hai, isliye item.product.price ya item.product.quantity nahi.Matlab V2 structure: item.product = kaunsa product, aur item.price / item.quantity = us order mein us product ko kis price par aur kitni quantity mein khareeda gaya.
                              // Old                                        V2
                              // groupProducts(o.products)         Direct o.products
                              // p._id                             item.product._id
                              // p.name                            item.product.name
                              // p.description                     item.product.description
                              // p.price                           item.price ✅ purchase-time price
                              // p.quantity                        item.quantity ✅ stored quantity
                              // o.products.length                 reduce() se actual quantity
                              // —                                 Product Total = price × quantity
                            >
                              <div className="col-auto">
                                <img
                                  src={`/api/v1/product/product-photo/${item?.product?._id}`}
                                  className="rounded"
                                  alt={item?.product?.name || "Product"}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div className="col ms-3">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <h6 className="fw-bold mb-0">
                                    {item?.product?.name}
                                  </h6>
                                  {item?.product?.shipping ? (
                                    <span className="badge bg-info text-dark shipping-required">
                                      🚚 Ship
                                    </span>
                                  ) : (
                                    <span className="badge bg-secondary shipping-not-required">
                                      No Shipping
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted small mb-1">
                                  {item?.product?.description?.substring(0, 50)}
                                  ...
                                </p>
                                <div className="d-flex gap-3 small fw-semibold text-secondary">
                                  <span>Price: ${item?.price?.toFixed(2)}</span>
                                  <span>Quantity: {item?.quantity}</span>
                                  <span>
                                    Total: $
                                    {(
                                      (item?.price || 0) * (item?.quantity || 0)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div className="m-2 p-3 AdminLoadMoreContainer">
                    {hasMore && (
                      <button
                        className="btn loadmore"
                        onClick={() => getOrders(page + 1, true)}
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
              ) : (
                /* No Orders Found State */
                <div
                  className="d-flex flex-column justify-content-center align-items-center text-center p-5 bg-white rounded-3 shadow-sm my-4"
                  style={{ minHeight: "350px" }}
                >
                  <div style={{ fontSize: "3.5rem" }} className="mb-2">
                    📦
                  </div>
                  <h4 className="fw-bold text-secondary">
                    No Orders Placed Yet
                  </h4>
                  <p className="text-muted mb-4">
                    Looks like customers haven't bought anything from your store
                    yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default AdminOrders;
//______________________________________________________________________________