import React from 'react';
import whiteLogo from "../../../assets/icons/logo-white.svg";
import instaWhite from "../../../assets/icons/insta-white.svg";
import facebook from "../../../assets/icons/facebook-white.svg";
import linkedIn from "../../../assets/icons/linkedin-white.svg";
import xIcon from "../../../assets/icons/x-white.svg";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-image bg-[url('src/assets/icons/footer.svg')] bg-cover bg-center">
        <div className="w-full text-white px-6 sm:px-16 lg:px-36 pt-20 flex flex-col lg:flex-row justify-between gap-10 lg:gap-0">
          {/* Left Section */}
          <div className="flex flex-col gap-2">
            <img className="pb-6 w-32" src={whiteLogo} alt="logo" />
            <p className="flex gap-1">
              <span>Phone:</span> +96612345678
            </p>
            <p className="flex gap-1">
              <span>Email:</span> example@mail.com
            </p>
            <p className="flex gap-1">
              <span>Location:</span> KSA - Riyadh
            </p>
            <div className="flex gap-4 pt-4">
              <img src={instaWhite} alt="insta" className="w-5 h-5" />
              <img src={facebook} alt="facebook" className="w-5 h-5" />
              <img src={linkedIn} alt="linkedin" className="w-5 h-5" />
              <img src={xIcon} alt="x-twitter" className="w-5 h-5" />
            </div>
          </div>

          {/* Company Section */}
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold pb-6">Company</p>
            <p>Who are we?</p>
            <p>Work Team</p>
            <p>Image Gallery</p>
          </div>

          {/* Services Section */}
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold pb-6">Our Services</p>
            <p>Ya Maraheb</p>
            <p>Eventify</p>
          </div>

          {/* Optional Duplicate Company Section */}
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold pb-6">Company</p>
            <p>Who are we?</p>
            <p>Work Team</p>
            <p>Image Gallery</p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="w-full text-white text-center py-6 text-sm border-t border-white/10 mt-10">
          All rights reserved • J EVENT 2025
        </div>
      </div>
    </div>
  );
}

export default Footer;
