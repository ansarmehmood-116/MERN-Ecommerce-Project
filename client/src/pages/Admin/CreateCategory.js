import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  //as we will have multipple values in categories so we have added array in useState i.e []
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false); //this will work with modal i.e visible and nonVisible
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  //___________________________________________________________________//

  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault(); //to close form from default behaviour
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in input form");
    }
  };
  //_______________________________________________________________________________

  //get all categories
  const getAllCategory = async () => {
    try {
      // const response=await axios.get("/api/v1/category/get-category");
      const { data } = await axios.get("/api/v1/category/get-category");
      //here we have destructured data directly instead of storing it in response variable
      //above because if we store above object in response variable above then we will use
      //response.data every where so it is shorcut to get data directly in {data} object.

      //Destructuring:Destructuring is a syntax in JavaScript that allows you to extract values
      //from arrays or properties from objects and assign them to variables in a more concise
      //and readable way. For example, const { data } = response; extracts the data property
      //from the response object and assigns it to the variable data.
      //________________________________________________________________________________
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  //The useEffect hook with an empty dependency array ([]) runs the code inside it (e.g.,
  //getAllCategory()) only once/initially, right after the component is first shown on the
  //screen.We can pass multipple functions inside useEffect.
  //The dependency array [] is used to list values that the useEffect depends on.
  //When the values in this array change, the useEffect runs again
  //An empty array [] means the useEffect runs only once, after the initial render.
  //when it is first displayed, useEffect ensures this happens only once, preventing
  //multiple fetches.
  useEffect(() => {
    getAllCategory();
  }, []);
  //________________________________________________________________________________

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //___________________________________________________________________________________

  //delete category
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`category is deleted`);

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };
  return (
    <Layout title={"Dashboard - Create-Category"}>
      {/* <h1>Create Category</h1> */}
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            {/* <h1>Create Category</h1> */}
            <h1 className="text-center categoryHeading">Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm  //Below we have passed the props values which we have used in
                             //category form
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div>
              {/* we have created this div and copied table from Bootsrap and converted it
              to jsx and removed exrat <tr></tr> i.e rows */}
              <table className="table">
                <thead>
                  <tr className="td">
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    //The question mark (?.) in categories?.map((c) => ...) is the optional
                    //chaining operator. It allows you to safely access properties or call
                    //methods on an object that might be null or undefined.
                    //In this case, categories?.map((c) => ...) ensures that the map method
                    //is only called if categories is not null or undefined. If categories is
                    //null or undefined, the expression will short-circuit and return undefined
                    //instead of throwing an error.
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary  ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          {/* for edit button we have used another css librarya ant-
                          design see in notes-0 folder for details we have to install its
                          package*/}
                          <button 
                          className="btn btn-danger ms-2"
                          onClick={()=>handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
