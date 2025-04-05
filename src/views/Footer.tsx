import React from 'react';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <section className='overflow-hidden bg-gradient-to-tr from-amber-950 to-orange-950 via-yellow-900 py-4 text-xs px-1 sm:px-0 font-bold' style={{ fontFamily: "Roboto" }}>
      <div className='grid lg:grid-cols-3 text-zinc-200'>
        <div className='sm:p-1 lg:border-r text-center'>
          <p className='flex justify-center items-center h-full flex-wrap'>Made in
            <span className='font-extrabold text-white flex items-center'>
              &nbsp;
              <span className='text-orange-600'>भा</span><span className='text-white'>र</span><span className='text-green-600'>त</span>
              &nbsp;
              <img src="https://bookjn-bucket.s3.ap-south-1.amazonaws.com/country-flags/ind.svg" alt="Indian Flag" width={16} height={16} />
            </span> &nbsp; || &copy; {new Date().getFullYear()} Gaurav Sahitya || All rights are reserved</p>

        </div>
        <div className="p-1 flex items-center justify-center lg:border-r">
          <a href={import.meta.env.VITE_PORTFOLIO_URL} className='mx-1 underline decoration-dashed underline-offset-2'>Portfolio Website</a> <a href="#" className='mx-1 underline decoration-dashed underline-offset-2'>CMS Portal</a>
        </div>
        <div className="p-1 mt-1 lg:mt-0 flex justify-evenly items-center">
          <FaLinkedin size={24} onClick={() => window.open(import.meta.env.VITE_LINKEDIN_URL, "_blank")} className='hover:cursor-pointer' />
          <FaInstagram size={24} onClick={() => window.open(import.meta.env.VITE_INSTAGRAM_URL, "_blank")} className='hover:cursor-pointer' />
          <FaTwitter size={24} onClick={() => window.open(import.meta.env.VITE_TWITTER_URL, "_blank")} className='hover:cursor-pointer' />
        </div>
      </div>
    </section>
  );
}

export default React.memo(Footer);
