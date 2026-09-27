import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./auth";

const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useAuth();
  
  //Only for paging purpose in Admin Orders using these states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadbtnstate, setLoadbtnstate]=useState(false);//loadMore button state

  const getOrders = async (pageNumber = 1, loadMore = false) => {
    try {
      //these 2 commented api line can be used when no paging needed
      // const { data } = await axios.get("/api/v1/order/all-orders");
      // setOrders(data);
      
      //remove this api from line 24 to 36 and 54,54 when paging not needed
       if(loadMore){
        setLoadbtnstate(true);
      }
      const { data } = await axios.get(
        `/api/v1/order/all-orders?page=${pageNumber}&limit=10`
      );
      if (loadMore) {
        setOrders((prev) => [...prev, ...data?.orders]);
      } else {
        setOrders(data?.orders);
      }
      setPage(pageNumber);
      setHasMore(data?.hasMore);
    } catch (error) {
      console.log(error);
    } finally {
      if (loadMore) {
      setLoadbtnstate(false);//this will false when loadmore btn load more pages
    } else {
      setLoading(false);//this will false only when page loads
    }
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders(1, false);
    }
  }, [auth?.token]);

  return (
    <OrdersContext.Provider
      value={[
        orders, 
        setOrders, 
        getOrders, 
        loading,
        //remove below 3 parameters when no paging needed
        page, 
        hasMore,
        loadbtnstate
         ]}
    >
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => useContext(OrdersContext);
export { useOrders, OrdersProvider };
