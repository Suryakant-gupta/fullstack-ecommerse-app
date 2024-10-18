import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      console.log("Token is missing");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      setOrders(response.data.orders.reverse()); // Assuming the orders are returned in response.data.orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const statusHandler = async(event, orderId)=>{
    try {
      const response = await axios.post(backendUrl + "/api/order/status", {orderId, status:event.target.value} , {headers: {token}});
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
      
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>

      <div className="">
        {
          orders.map((order, index) => (
            <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
              <img className='w-12' src={assets.parcel_icon} alt="Parcel Icon" />

              <div>

                <div className="">
                  {
                    order.items.map((item, itemIndex) => {
                      if (itemIndex === order.items.length - 1) {
                        // This is the last item
                        return <p className='py-0.5' key={itemIndex}>{item.name} X {item.quantity} <span>{item.size}</span></p>;
                      } else {
                        return <p className='py-0.5' key={itemIndex}>{item.name} X {item.quantity} <span>{item.size}</span> ,</p>;

                      }
                    })
                  }
                </div>

                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>

                <div className="">
                  <p>{order.address.street + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode} </p>
                </div>

                <p>{order.address.phone}</p>
              </div>

              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toDateString()}</p>
              </div>

              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

              <select onChange={(e) => statusHandler(e, order._id)} className='p-2 font-semibold' value={order.status}>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders;
