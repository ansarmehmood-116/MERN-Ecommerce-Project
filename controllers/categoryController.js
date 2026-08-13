import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, resp) => {
  try {
    const { name } = req.body;
    if (!name) {
      return resp.status(401).send({ message: "Name is required" });
    }

    //for duplicate removel if already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return resp.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    //for inserting new category
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    resp.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log("Error");
    resp.send(500).send({
      success: false,
      error,
      message: "Error in Categroy",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, 
        slug: slugify(name)
      },
      { 
       new: true 
      }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//getAll category controller
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
export const singleCategoryController = async (req, res) => {
  try {
    // const {slug}=req.params; we should pass it directly in below findOne function
    const category = await categoryModel.findOne({ 
      slug: req.params.slug 
    });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
export const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    //here we donot need to save await in a variable
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};
