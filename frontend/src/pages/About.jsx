import React from 'react'
import Title from '../components/Title';
import NewsLetterBox from '../components/NewsLetterBox';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-1" >
        <Title text1={"ABOUT"} text2={"US"}/>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img src={assets.about_img} alt="" className='w-full max-w-[450px] ' />
        <div className="flex flex-col justify-center gap-6 md:w-1/2 text-gray-600">
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum hic velit ducimus dolores, recusandae numquam optio quas temporibus autem aliquid modi provident repellendus nulla id est laudantium dolorum nemo deleniti.</p>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum maiores numquam perferendis consectetur! Ducimus quod accusamus magnam earum ab eligendi?</p>

          <b className='text-gray-800 '>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est atque at odio, quibusdam ut, quae fugiat iusto accusantium omnis officia ad? Praesentium, necessitatibus assumenda vel illo dolores atque sapiente facilis.</p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 py-8 md:px-16 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className='text-gray-600 '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, sit Lorem ipsum dolor sit.</p>
        </div>
        <div className="border px-10 py-8 md:px-16 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className='text-gray-600 '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, sit Lorem ipsum dolor sit.</p>
        </div>
        <div className="border px-10 py-8 md:px-16 sm:py-20 flex flex-col gap-5">
          <b>Exceptionl Customer Service :</b>
          <p className='text-gray-600 '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, sit Lorem ipsum dolor sit.</p>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About