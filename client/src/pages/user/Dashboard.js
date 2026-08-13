import React,{useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const [auth]=useAuth();

   //useEffect for AOS Animation Effect
   useEffect(() => {
    AOS.init({ duration: 1500 });
  });
  return (
    <div>
        <Layout title={"Dashboard Ecommerce App"}>
          {/* <h1>Dashboard Page</h1> */}
          <div className="container-fluid p-3 dashboard">
            <div className="row">
              <div className="col-md-3" data-aos="flip-left">
                <UserMenu/>
              </div>
              <div className="col-md-9">
                <div className="card w-75 p-3 userDetails">
                  <h3>Name:    {auth?.user.name}</h3>
                  <h3>Email:   {auth?.user.email}</h3>
                  <h3>Address: {auth?.user.address}</h3>
                  <h3 className="text-primary">
                  Status: {auth?.user?.role === 0 ? "Customer" : "Admin"}
                </h3>
                </div>
              </div>
            </div>
          </div>
        </Layout>
    </div>
  )
}

export default Dashboard
