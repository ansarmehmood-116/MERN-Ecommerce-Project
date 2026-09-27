import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import "./AdminStyles/AdminUsers.css";

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true); //main page loader

  // Fetch users from the API
  const getAdminUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/admins");

      const admins = data.users.filter((user) => user.role !== 0);

      setAdminUsers(admins);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All-Admins"}>
      <div className="admin-users-page">
        <div className="container-fluid p-3 dashboard">
          <div className="row g-3">
            {/* Admin Menu */}
            <div className="col-md-3">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <h1 className="text-center usersHeading rounded-2">All Admins</h1>
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
                  <div className="admin-users-table-wrapper border rounded-2 overflow-hidden shadow">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" className="text-center">
                              #
                            </th>
                            <th scope="col" className="text-center">
                              Name
                            </th>
                            <th scope="col" className="text-center">
                              Email
                            </th>
                            <th scope="col" className="text-center">
                              Phone
                            </th>
                            <th scope="col" className="text-center">
                              Address
                            </th>
                            <th scope="col" className="text-center">
                              Role
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {adminUsers.length > 0 ? (
                            adminUsers.map((user, index) => (
                              <tr key={user._id}>
                                <td className="text-center fw-semibold">
                                  {index + 1}
                                </td>

                                <td className="text-center fw-semibold">
                                  {user.name}
                                </td>

                                <td className="text-center">{user.email}</td>

                                <td className="text-center">
                                  {user.phone || "—"}
                                </td>

                                <td className="text-center">
                                  {user.address || "—"}
                                </td>

                                <td className="text-center">
                                  <span className="admin-role-badge">
                                    Admin
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center admin-no-users"
                              >
                                No admin users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {/* Admin count */}
              <div className="admin-users-count">
                Total Admins: <strong>{adminUsers.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
