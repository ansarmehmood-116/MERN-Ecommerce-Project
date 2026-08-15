import React from "react";
import { useState,useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/users");
      const nonAdminUsers = data.users.filter(user => user.role !== 1);
      setUsers(nonAdminUsers); // Only set users who are not admins
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  // Delete a user
  const handleDelete = async (userId) => {
    try {
      let answer = window.prompt("Are You Sure want to delete this user?");
      if (!answer) return;

      await axios.delete(`/api/v1/auth/user/${userId}`);
      toast.success("User deleted successfully");
      // Update the UI
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout title={'Dashboard - All-Users'}>
       {/* <h1>All Users</h1>  */}
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 table-responsive">
            <h1 className="text-center usersHeading">All Users</h1>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td onClick={() => handleDelete(user._id)}>
                      {/* this is anonymous function we want not to delete itself all the users so we have passed callback function to call each time on click and passed argument referance so it can know the user on which we clicked */}
                      <MdDelete fontSize={20} style={{cursor:"pointer",color:"red"}}/>
                    </td>
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

export default Users;
