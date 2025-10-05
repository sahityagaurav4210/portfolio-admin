import React from 'react';

function Footer() {
  return (
    <section className='w-full overflow-hidden bg-gradient-to-tr from-amber-950 to-orange-950 via-yellow-900 py-4 text-xs px-1 sm:px-0 font-bold' style={{ fontFamily: "Roboto" }}>
      <div className='text-center text-white'>
        <p className='flex justify-center items-center h-full flex-wrap'>Made in
          <span className='font-extrabold text-white flex items-center'>
            &nbsp;
            <span className='text-orange-600'>भा</span><span className='text-white'>र</span><span className='text-green-600'>त</span>
            &nbsp;
            <img src="https://bookjn-bucket.s3.ap-south-1.amazonaws.com/country-flags/ind.svg" alt="Indian Flag" width={16} height={16} />
          </span> &nbsp; || &copy; {new Date().getFullYear()} Gaurav Sahitya || All rights are reserved
        </p>

      </div>
    </section>
  );
}

export default React.memo(Footer);
