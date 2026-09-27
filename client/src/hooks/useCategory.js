//for naming convention we must start every file name with use

//this hook i.e useCategory is only for homePage navbar category
//we also can use this hook for other utilities and category every where.

import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log("FETCH CATEGORIES ERROR:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}