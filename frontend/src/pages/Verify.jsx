import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { navigate,token, setCartItems, backendURL } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
//   console.log(token, backendURL);
  

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendURL + "/api/order/verifyStripe", { success, orderId }, { headers: { token } });
      
      console.log(response.data); // Log response to check what data you are getting

      if (response.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        navigate('/cart');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]); // Ensure token is available before calling verifyPayment()

  return <div></div>;
};

export default Verify;
