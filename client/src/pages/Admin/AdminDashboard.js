import React,{ useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminDashboard = () => {
  const [auth] = useAuth();
    //useEffect for AOS Animation Effect
    useEffect(() => {
      AOS.init({ duration: 1500 });
    });
  return (
    <Layout>
      {/* <h1>Admin Dashboard</h1> */}
      <div className="container-fluid  p-3 dashboard">
        <div className="row">
          <div className="col-md-3" data-aos="flip-left">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3 adminDetails">
              <h3>Name : {auth?.user.name}</h3>
              <h3>Email : {auth?.user.email}</h3>
              <h3>Contact : {auth?.user.phone}</h3>
               {/* Check for role and display status */}
               <h3 className="text-primary">
                  Status: {auth?.user?.role === 1 ? "Admin" : "User"}
                </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
