// import React from 'react';
import Logo from '../assets/logo.webp';

const Footer = () => {
  return (
    <div className="w-full px-5 py-5 xl:m-0 mt-5 flex justify-between gap-2 font-semibold xl:text-sm">
      <span className="hidden xl:inline-flex text-sm">
        Syncify Teams
      </span>
      <div className="flex gap-1 items-center">
        <span className="text-sm">© Nguyen Mai Duy</span>
        <img src={Logo} className=" w-10 h-10 animate-spin-slow" />
      </div>
    </div>
  );
};

export default Footer;
