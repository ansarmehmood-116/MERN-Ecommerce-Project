import React, { createContext, useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {useAuth} from './auth'; // Adjust the import path as necessary

const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [auth,setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/all-orders');
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <OrdersContext.Provider value={[ orders, setOrders, getOrders ]}>
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => useContext(OrdersContext);
export { useOrders,  OrdersProvider };