import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
// import { useAuth } from "../../context/auth";
import { useOrders } from "../../context/ordersNotifyContext"; //as we have used as context
import moment from "moment";
import { Select } from "antd";
import { MdDelete } from "react-icons/md";
const { Option } = Select; //we have destructured these option from select.


const AdminOrders = () => {
  const [status,setStatus] = useState([
    //here we have filled the useState with enum we have
    //created in orders model.
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);

  const [orders, setOrders, getOrders] = useOrders(); // Use context for orders
  const [changeStatus, setCHangeStatus] = useState("");
  //_______________________________________________________________________________________
  //if we donot want to use the context orderProvider then use following function manually here but it will not accessable anywhere except this page.

  // const [auth, setAuth] = useAuth();
  // const [orders, setOrders] = useState([]);

  //   const getOrders = async () => {
  //     try {
  //       const { data } = await axios.get("/api/v1/auth/all-orders");
  //       setOrders(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     if (auth?.token) getOrders();
  //   }, [auth?.token]);
  //________________________________________________________________________________________

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const groupProducts = (products) => {
    return products.reduce((acc, product) => {
      const foundProduct = acc.find((p) => p._id === product._id);
      if (foundProduct) {
        foundProduct.quantity += 1;
      } else {
        acc.push({ ...product, quantity: 1 });
      }
      return acc;
    }, []);
  };

  //delete a order
  const handleDelete = async (orderId) => {
    try {
      let answer = window.prompt("Are You Sure want to delete this order ? ");
      //this is used to prevent from accidental deletion.
      if (!answer) return;
      const {data} = await axios.delete(
        `/api/v1/auth/delete-order/${orderId}`
      );
      toast.success("Order Deleted Succfully");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            {/* <AdminMenu orders={orders}/> 
            it works better but this prop is used only inside orders so it will show notification only in orders page AdminMenu because we have used only in here props so the remaining pages will not know about this props which has adminMenu so either we have to pass {orders} props in all components in adminMenu but this will very difficult to pass in each page manuall so we have used globally context orders*/}
            <AdminMenu/>
          </div>
          <div className="col-md-9">
            <h1 className="text-center ordersHeading">All Orders</h1>
            {orders?.map((o, i) => {
              const groupedProducts = groupProducts(o?.products);
              return (
                <div className="border shadow table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <Select
                            border={false}
                            onChange={(value) => handleChange(o._id, value)}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                        <td  onClick={()=>handleDelete(o._id)}>
                            < MdDelete fontSize={20} style={{cursor:"pointer",color:"red"}} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {/* {o?.products?.map((p, i) => ( */}
                    {groupedProducts?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                          <p>Quantity: {p.quantity}</p> {/* Display quantity */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
