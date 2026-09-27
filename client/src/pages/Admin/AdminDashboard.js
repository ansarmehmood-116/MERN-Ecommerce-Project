import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserShield, 
  FaUserCircle, 
  FaCheckCircle, 
  FaLayerGroup,
  FaGlobe,
  FaClock 
} from "react-icons/fa";
import "./AdminStyles/AdminDashboard.css";

 // Added empty dependency array [] to prevent re-initializing AOS on every render
const AdminDashboard = () => {
  const [auth] = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Layout title={"Admin Dashboard"}>
      {/* Container height controlled to avoid vertical overflow */}
      <div
        className="container-fluid p-3 Admindashboard"
      >
        <div className="row g-3 ">
          {/* Sidebar Menu */}
          <div className="col-md-3" data-aos="flip-left">
            <AdminMenu />
          </div>

          {/* Main Content Area */}
          <div className="col-md-9" data-aos="fade-up">
            <div className="card border-0 AdmindetailsCard shadow rounded-3 d-flex flex-column">
              
              {/* Header Banner */}
              <div className="adminDetails card-header border-bottom p-3 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-0 fw-bold fs-5 d-flex align-items-center gap-2 ">
                    <FaUserCircle className="fs-3 text-primary" /> Admin Dashboard
                  </h4>
                  <p className="mb-0 text-muted small mt-1 ">
                    Overview of account credentials and privileges
                  </p>
                </div>
                <span
                  className={`badge ${
                    auth?.user?.role === 1 ? "bg-primary" : "bg-secondary"
                  } px-3 py-2 fs-6 rounded-3`}
                >
                  {auth?.user?.role === 1 ? "Administrator" : "User Account"}
                </span>
              </div>

              {/* Card Body - Grid Layout adjusted for tight layout */}
              <div className="card-body p-3 p-md-4 flex-grow-1">
                <div className="row g-2">
                  
                  {/* Name */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaUser className="text-muted fs-5" />
                      <div>
                        <div className="text-muted small">Full Name</div>
                        <div className="fw-semibold text-dark text-break">
                          {auth?.user?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaEnvelope className="text-muted fs-5" />
                      <div>
                        <div className="text-muted small">Email Address</div>
                        <div className="fw-semibold text-dark text-break">
                          {auth?.user?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaPhone className="text-muted fs-5" />
                      <div>
                        <div className="text-muted small">Contact Phone</div>
                        <div className="fw-semibold text-dark">
                          {auth?.user?.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Role Tier */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaLayerGroup className="text-muted fs-5" />
                      <div>
                        <div className="text-muted small">Role Tier</div>
                        <div className="fw-semibold text-dark">
                          {auth?.user?.role === 1 ? "Level 1 (Full)" : "Level 0 (Basic)"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Access */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaUserShield className="text-primary fs-5" />
                      <div>
                        <div className="text-muted small">System Access</div>
                        <div className="fw-semibold text-primary">
                          {auth?.user?.role === 1
                            ? "Full Admin Privileges"
                            : "Standard Privileges"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaCheckCircle className="text-success fs-5" />
                      <div>
                        <div className="text-muted small">Account Status</div>
                        <div className="fw-semibold text-success">
                          Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SIMPLE FINAL ROW - Information Only */}
                  <div className="col-md-12">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaGlobe className="text-muted fs-5" />
                      <div>
                        <div className="text-muted small">Environment</div>
                        <div className="fw-semibold text-dark">
                          Production Portal
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-md-6">
                    <div className="p-2 px-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                      <FaClock className="text-success fs-5" />
                      <div>
                        <div className="text-muted small">Last Login Session</div>
                        <div className="fw-semibold text-success">
                          Active Now
                        </div>
                      </div>
                    </div>
                  </div> */}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
//________________________________________________________________

// import React,{ useEffect } from "react";
// import Layout from "../../components/Layout/Layout";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import { useAuth } from "../../context/auth";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const AdminDashboard = () => {
//   const [auth] = useAuth();
//     //useEffect for AOS Animation Effect
//     useEffect(() => {
//       AOS.init({ duration: 1500 });
//     });

//   return (
//     <Layout>
//       {/* <h1>Admin Dashboard</h1> */}
//       <div className="container-fluid  p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3" data-aos="flip-left">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="card w-75 p-3 adminDetails">
//               <h3>Name : {auth?.user.name}</h3>
//               <h3>Email : {auth?.user.email}</h3>
//               <h3>Contact : {auth?.user.phone}</h3>
//                {/* Check for role and display status */}
//                <h3 className="text-primary">
//                   Status: {auth?.user?.role === 1 ? "Admin" : "User"}
//                 </h3>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboard;
