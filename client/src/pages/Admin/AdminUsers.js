import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);

  // Fetch users from the API
  const getAdminUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/admins");
      const admins = data.users.filter(user => user.role !== 0); // Filter to get only admins
      setAdminUsers(admins); // Set the state with admin users
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getAdminUsers();
  }, []);

  return (
    <Layout title={'Dashboard - All-Admins'}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center usersHeading">All Admins</h1>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
