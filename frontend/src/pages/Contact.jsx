import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t ">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28">
        <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>89344 Williams Hueston <br /> Suite lucia 88, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555-0123 <br /> Email : mattersolved@gmail.com</p>
          <p className='text-gray-600 font-semibold text-xl'>Carrers at Forever</p>
          <p className='text-gray-500 font-semibold text-xl'>Learn more about our teams and job openings</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default Contact