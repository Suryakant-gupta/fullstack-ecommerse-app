import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName : '' ,
    lastName : '' ,
    email : '' ,
    street : '' ,
    city : '' ,
    state : '' ,
    zipcode : '' ,
    country : '' ,
    phone : '' 
  });

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({...data, [name]: value}));
  }

  const initPay = (order)=>{
    const options ={
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async(response) => {
        console.log(response);
        
        try {
          
          const {data} = await axios.post(backendURL + "/api/order/verifyRazorpay" ,response, {headers:{token}});
          if(data.success){
            navigate("/orders")
            setCartItems({});
          }

        } catch (error) {
          console.log(error);
          toast.error(error)
          
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open()
  }


  const onSubmitHandler = async (e)=>{
    e.preventDefault();

    try {
      
      const orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id = items))

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item]

              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address : formData, 
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {

        // call for COD order
        case 'cod':
          const response = await axios.post(backendURL + "/api/order/place", orderData, {headers:{token}});
        // console.log(response.data);
        
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          }else{
            toast.error(response.data.message);;
          }
          break;

          case 'stripe':
            const responseStripe = await axios.post(backendURL + "/api/order/stripe", orderData, {headers:{token}});
            console.log(responseStripe.data);

            if (responseStripe.data.success) {
              const {session_url} = responseStripe.data
              window.location.replace(session_url)
            
            }else{
              toast.error(responseStripe.data.message);;
            }
            
             
            break;

          case 'razorpay':
            const responseRazorpay = await axios.post(backendURL + "/api/order/razorpay", orderData, {headers:{token}});
            console.log(responseRazorpay.data);

            if (responseRazorpay.data.success) {
             initPay(responseRazorpay.data.order);
             
            
            
            }
            // else{
            //   toast.error(responseRazorpay.data.message);;
            // }
            break;
      
        default:
          break;
      }
      

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }
 


  

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-4 pt-5 min-h-[80vh] border-t'>
      {/* left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={'INFORMATION'} />
        </div>

        <div className="flex gap-3 ">
          <input required type="text" onChange={onChangeHandler} value={formData.firstName} name='firstName' placeholder='First name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required type="text" onChange={onChangeHandler} value={formData.lastName} name='lastName' placeholder='Last name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required type="email" onChange={onChangeHandler} value={formData.email} name='email' placeholder='example@email.com' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required type="text" placeholder='Street' onChange={onChangeHandler} value={formData.street} name='street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className="flex gap-3 ">
          <input required type="text" onChange={onChangeHandler} value={formData.city} name='city' placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required type="text" placeholder='State' onChange={onChangeHandler} value={formData.state} name='state' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className="flex gap-3 ">
          <input required type="number" onChange={onChangeHandler} value={formData.zipcode} name='zipcode' placeholder='Zip Code' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required type="text" onChange={onChangeHandler} value={formData.country} name='country' placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required type="tel" placeholder='Phone' onChange={onChangeHandler} value={formData.phone} name='phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />

      </div>


      {/* -------- Right Side --------------- */}

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 ">
          <Title text1={'PAYMENT'} text2={'METHODS'} />

          {/* ------------- Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">

            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''} `}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
            </div>

            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''} `}></p>
              <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
            </div>

            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer ">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>

          </div>

          <div className="w-full text-end mt-8">
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder