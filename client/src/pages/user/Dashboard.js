import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import AOS from "aos";
import "aos/dist/aos.css";
import "./UserStyles/UserDashboard.css";
import axios from "axios"; //for backend

const Dashboard = () => {
  const [auth] = useAuth(); //for user details
  //for user dashboard states
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [favourites, setFavourites] = useState(0);

  //UI cards animation effect
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  //_________________________________

  //Dashboard states
  const getDashboardStats = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/dashboard-stats");

      setTotalOrders(data?.totalOrders || 0);
      setActiveOrders(data?.activeOrders || 0);
    } catch (error) {
      console.log(error);
    }
  };
  //_________________________________

  //Favourites count for user this function is called in above dashboard useEffect
  const getFavourites = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/favourites");
      const favouriteProducts = data?.favourites || data || [];
      setFavourites(favouriteProducts?.length);
    } catch (error) {
      console.log(error);
    }
  };
  //_________________________________

  //common useEffect for both above
  useEffect(() => {
    if (auth?.token){
      getDashboardStats();
      getFavourites();
    }
  }, [auth?.token]);
  //_________________________________

  return (
    <Layout title={"User Dashboard - Ecommerce App"}>
      <div className="user-dashboard-page">
      <div className="container-fluid p-3 dashboard">
        <div className="row g-3">
          {/* User Menu */}
          <div className="col-md-3 " data-aos="fade-right">
            <UserMenu />
          </div>

          {/* Dashboard Content */}
          <div className="col-md-9">
            {/* Welcome */}
            <div className="dashboard-welcome" data-aos="fade-down">
              <div>
                <h2>Welcome, {auth?.user?.name || "User"} 👋</h2>
                <p>
                  Manage your account and keep track of your shopping activity.
                </p>
              </div>
              <div className="welcome-icon">👤</div>
            </div>

            {/* Statistics */}
            <div className="row g-1 dashboard-stats">
              <div className="col-sm-6 col-lg-4" data-aos="zoom-in">
                <div className="dashboard-stat-card">
                  <div className="stat-icon orders-icon">🛍️</div>

                  <div>
                    <h6>Total Orders</h6>
                    <h3>{totalOrders}</h3>
                    <span>Your total purchases</span>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4" data-aos="zoom-in">
                <div className="dashboard-stat-card">
                  <div className="stat-icon active-icon">📦</div>
                  <div>
                    <h6>Active Orders</h6>
                    <h3>{activeOrders}</h3>
                    <span>Processing & shipped</span>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4" data-aos="zoom-in">
                <div className="dashboard-stat-card">
                  <div className="stat-icon favourite-icon">❤️</div>

                  <div>
                    <h6>Favourites</h6>
                    <h3>{favourites}</h3>
                    <span>Saved products</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="dashboard-card userDetails" data-aos="fade-up">
              <div className="dashboard-card-header">
                <div>
                  <h4>Account Information</h4>
                  <p>Your personal account details</p>
                </div>

                <div className="card-header-icon">👤</div>
              </div>

              <div className="account-info">
                <div className="info-row">
                  <span className="info-label">Name</span>

                  <span className="info-value">
                    {auth?.user?.name || "N/A"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Email</span>

                  <span className="info-value">
                    {auth?.user?.email || "N/A"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Address</span>

                  <span className="info-value">
                    {auth?.user?.address || "Not provided"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Account Type</span>

                  <span className="status-badge">
                    {auth?.user?.role === 0 ? "Customer" : "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
//__________________________________________________________________________

// ____________OLD DASHBOARD VERSION____________
// import React,{useEffect} from 'react'
// import Layout from '../../components/Layout/Layout'
// import UserMenu from '../../components/Layout/UserMenu'
// import { useAuth } from '../../context/auth'
// import AOS from "aos";
// import "aos/dist/aos.css";
// import "./UserStyles/UserDashboard.css";

// const Dashboard = () => {
//   const [auth]=useAuth();

//    //useEffect for AOS Animation Effect
//    useEffect(() => {
//     AOS.init({ duration: 1500 });
//   });
//   return (
//     <div>
//         <Layout title={"Dashboard Ecommerce App"}>
//           {/* <h1>Dashboard Page</h1> */}
//           <div className="container-fluid p-3 dashboard">
//             <div className="row">
//               <div className="col-md-3" data-aos="flip-left">
//                 <UserMenu/>
//               </div>
//               <div className="col-md-9">
//                 <div className="card w-75 p-3 userDetails">
//                   <h3>Name:    {auth?.user.name}</h3>
//                   <h3>Email:   {auth?.user.email}</h3>
//                   <h3>Address: {auth?.user.address}</h3>
//                   <h3 className="text-primary">
//                   Status: {auth?.user?.role === 0 ? "Customer" : "Admin"}
//                 </h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Layout>
//     </div>
//   )
// }
// export default Dashboard
// _____________________________________________
